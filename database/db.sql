// create t_people
create table t_people ( people_id text primary key, people_name text not null unique, people_sex text not null, people_email text not null unique, account_balance numeric, default_join integer, default_recivemail integer, delete_flag integer);

// insert data
insert into t_people(people_id, people_name, people_sex, people_email, account_balance, default_join, default_recivemail, delete_flag ) values ('138', 'dairugang', 'ÄÐ', 'dairugang@use.com.cn', '0.0', '0', '1', '0') 