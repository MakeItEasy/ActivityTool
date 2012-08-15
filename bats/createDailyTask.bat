set task=e:\DailyBackupDatabase.bat
rem schtasks /create /sc minute /tn databasebackup /tr e:\DailyBackupDatabase.bat
schtasks /create /sc daily /tn databasebackup /tr %task% /st 10:00