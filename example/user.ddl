CREATE TABLE user (
   userid    VARCHAR(100) NOT NULL,
   password  VARCHAR(50) NOT NULL,
   username  VARCHAR(200) NOT NULL,
   userlevel CHAR(1) NOT NULL,
   updatetimestamp TIMESTAMP NOT NULL GENERATED ALWAYS FOR EACH ROW ON UPDATE AS ROW CHANGE TIMESTAMP,
   PRIMARY KEY (userid));