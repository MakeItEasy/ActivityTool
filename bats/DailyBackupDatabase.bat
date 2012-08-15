set srcDir=e:\
set desDir=e:\
set fileName=database.txt

rem copy database.txt [%date:~0,4%%date:~5,2%%date:~8,2%][%time:~0,2%%time:~3,2%%time:~6,2%]database.txt
copy %srcDir%%fileName% %desDir%[%date:~0,4%%date:~5,2%%date:~8,2%][%time:~0,2%%time:~3,2%%time:~6,2%]%fileName%