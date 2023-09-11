CREATE DATABASE crud_cookiesSession;

use crud_cookiesSession;

create table users(
    _id_user int not null auto_increment,
    _username varchar(50) not null,
    _password varchar(255) not null,
    constraint pk_id_user primary key (_id_user)
);

create table sesions(
    _id_session varchar(255) not null,
    _id_user_count int not null,
    _time timestamp not null default current_timestamp,
    constraint pk_id_session primary key (_id_session)
);

create table projects(
    _id_project int not null auto_increment,
    _title varchar(255) not null,
    _description text not null,
    _link varchar(255) not null,
    _id_user_count_1 int not null,
    constraint pk_id_project primary key (_id_project)
);

SET GLOBAL event_scheduler = ON;

CREATE EVENT clear_session_week
ON SCHEDULE EVERY 1 WEEK
ON COMPLETION PRESERVE 
ENABLE
    DO
        DELETE FROM links WHERE created_at < now() - INTERVAL 7 DAY;

