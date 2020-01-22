function test(){
  var yearMonth = '201911';
  createS3UploadFiles(yearMonth);
  
  var targetFolder = getFolderForErogeReleaseBot(yearMonth);
  var ss = getSpreadSheetForErogeReleaseBot(targetFolder, yearMonth);
    
  var gamesSheet = getSheet('games', ss);
  var gamesData = gamesSheet.getRange(2, 1, gamesSheet.getLastRow() - 1, gamesSheet.getLastColumn()).getValues();
  var gamesCsv = buildCSV(gamesData);
  uploadCsvToS3(buildUploadPath(yearMonth, 'games') ,gamesCsv);
  
  var gameCastsSheet = getSheet('game_casts', ss);
  var gameCastsData = gameCastsSheet.getRange(2, 1, gameCastsSheet.getLastRow() - 1, gameCastsSheet.getLastColumn()).getValues();
  var gameCastsCsv = buildCSV(gameCastsData);
  uploadCsvToS3(buildUploadPath(yearMonth, 'game_casts'), gameCastsCsv);

  var brandsSheet = getSheet('brands', ss);
  var brandsData = brandsSheet.getRange(2, 1, brandsSheet.getLastRow() - 1, brandsSheet.getLastColumn()).getValues();
  var brandsCsv = buildCSV(brandsData);
  uploadCsvToS3(buildUploadPath(yearMonth, 'brands'), brandsCsv);
}

/**
 * アップロード用のパスを生成する
 * @param {String} [yearMonth] - 年月文字列
 * @param {String} [csvFileName] - csvファイル名
 * @param {String} - アップロード先パス
 */
function buildUploadPath(yearMonth, csvFileName) {
  return yearMonth + '/' + csvFileName + '.csv';
}

/**
 * CSVファイルをS3にアップロードする
 * @param {String} [filePath] - ファイルパス
 * @param {Blob} - CSV用のBlogオブジェクト
 */
function uploadCsvToS3(filePath, csv) {
  var s3 = S3.getInstance(Config.AwsAccessKeyID, Config.AwsSecretAccessKey);

  result = s3.putObject(Config.AwsS3BucketName, filePath, csv, {logRequests:true});
  console.info(result);
}

/**
 * 今月のゲーム情報からS3にアップロードするようのファイルにへの書き込み処理を行う
 */
function createS3UploadFilesForThisMonth(){
  createS3UploadFiles(getNowYearMonth());
}

/**
 * S3にアップロードするようのファイルにへの書き込み処理を行う
 * @param {String} [sheetName] - データを取得するシート名
 */
function createS3UploadFiles(sheetName){
  // ブランド・ゲームの出演情報・ゲーム情報を書き込む
  var createSpreadSheetResult = createSpreadSheet(sheetName, sheetName);
  var ss = SpreadsheetApp.openById(createSpreadSheetResult["id"]);
  createBrandsSheet(ss, sheetName);
  createGameCasts(ss, sheetName);
  createGamesSheet(ss, sheetName);
}

/**
 * brandsシートの書き込み処理
 * TODO：同じブランド情報が書き込まれてしまう問題あり（解決するかどうかはまた別問題）
 * @param {Spreadsheet} [spreadSheet] - SpreadsheetObject
 * @param {String} [sheetName] - データを取得するシート名
 */
function createBrandsSheet(spreadSheet, sheetName) {
  var sheet = createSheet(spreadSheet, "brands");

  // ヘッダー行の書き込み
  sheet.getRange(1, 1).setValue('ブランドID');
  sheet.getRange(1, 2).setValue('ブランド名');
  sheet.getRange(1, 3).setValue('ブランドURL');
  
  var datas = getEliminateDuplicationData(sheetName);

  datas.forEach(function(data, index){
    // indexが０始まりなので+1、ヘッダー行より下に書き込むのでさらに+1
    row = index + 1 + 1;
    sheet.getRange(row, 1).setValue(data[Columns.ArrayValue(Columns.BrandID)]);
    sheet.getRange(row, 2).setValue(data[Columns.ArrayValue(Columns.BrandName)]);
    sheet.getRange(row, 3).setValue(data[Columns.ArrayValue(Columns.BrandPage)]);
  });
}

/**
 * game_castsシートの書き込み処理
 * @param {Spreadsheet} [spreadSheet] - SpreadsheetObject
 * @param {String} [sheetName] - データを取得するシート名
 */
function createGameCasts(spreadSheet, sheetName) {
  var sheet = createSheet(spreadSheet, "game_casts");
  
  // ヘッダー行の書き込み
  sheet.getRange(1, 1).setValue('ゲームID');
  sheet.getRange(1, 2).setValue('声優ID');
  sheet.getRange(1, 3).setValue('声優名');
  
  var voiceActorDatas = getVoiceActorsByGameID(sheetName);
  var rowIndex = 2; // ヘッダー行より下に書き込むのでさらに2始まりとする

  Object.keys(voiceActorDatas).forEach(function(gameID){
    voiceActorDatas[gameID].forEach(function(voiceActor){
      sheet.getRange(rowIndex, 1).setValue(gameID);
      sheet.getRange(rowIndex, 2).setValue(getVoiceActorID(voiceActor));
      sheet.getRange(rowIndex, 3).setValue(voiceActor);
      rowIndex = rowIndex + 1;
    });
  });
}

/**
 * gamesシートの書き込み処理
 * @param {Spreadsheet} [spreadSheet] - SpreadsheetObject
 * @param {String} [sheetName] - データを取得するシート名
 */
function createGamesSheet(spreadSheet, sheetName) {
  var sheet = createSheet(spreadSheet, "games");
  
  // ヘッダー行の書き込み
  sheet.getRange(1, 1).setValue('ゲームID');
  sheet.getRange(1, 2).setValue('タイトル');
  sheet.getRange(1, 3).setValue('ブランドID');
  sheet.getRange(1, 4).setValue('発売日');
  sheet.getRange(1, 5).setValue('ゲーム紹介ページ');
  
  var datas = getEliminateDuplicationData(sheetName);

  datas.forEach(function(data, index){
    // indexが０始まりなので+1、ヘッダー行より下に書き込むのでさらに+1
    row = index + 1 + 1;  

    // スクレイピングで変な文字列を取得されてしまうため末尾の文字を削除する
    var title = data[Columns.ArrayValue(Columns.Title)];
    if (title.slice(-1) == '　') title = title.slice(0, -1);
   
    sheet.getRange(row, 1).setValue(data[Columns.ArrayValue(Columns.ID)]); 
    sheet.getRange(row, 2).setValue(title);
    sheet.getRange(row, 3).setValue(data[Columns.ArrayValue(Columns.BrandID)]);
    sheet.getRange(row, 4).setValue(data[Columns.ArrayValue(Columns.ReleaseDate)]);
    sheet.getRange(row, 5).setValue(data[Columns.ArrayValue(Columns.IntroductionPage)]);
  });
}
