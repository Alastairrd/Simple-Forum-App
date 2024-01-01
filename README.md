///////////////////////////////////////////////////////////////////////

Welcome to Alastair's Happy Lil' Forum app

///////////////////////////////////////////////////////////////////////

///
NOTES FOR MARKERS/GRADERS
///

Below is a number of logins to use, the website will not allow you to post or comment unless joined to a topic, and you cannot join topics without logging in first.
The first login can post anywhere, the second two are blank slates, and so you can see the difference / join topics yourself.

TESTING User Logins:
(MEMBER OF EVERY TOPIC)

Username: Marker1

Password: Marker1

(NOT A MEMBER OF ANYTHING)

Username: Marker2

Password: Marker2

(NOT A MEMBER OF ANYTHING)

Username: Marker3

Password: Marker3

Three logins for testing/marking purposes, on Marker2 and Marker3, you are not a member of anything so that you can try joining topics and see what the pages look like without being a member of them as well.

/////////////////////
INSTALLATION 
INSTRUCTIONS
/////////////////////

1. Download github repo / extract files to desired directory
2. Make sure you have the latest version of node.js and npm installed.
3. From command line in linux, enter:

sudo apt-get update

sudo apt-get install nodejs

sudo apt install npm

4. Navigate to directory with CMD line
5. type npm install to install required node modules
6. Make sure you have the latest version of MYSQL Server installed and have set up your root user, on linux you can do this via:

sudo apt-get update

sudo apt-get install mysql-server

5. in the MYSQL command line, type: CREATE USER 'forumuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'ardforum2023';
6. Make sure your command line is situated in forum app directory.
7. open MYSQL cmd line, on linux this is: sudo mysql
8. Run create_db file, with: source create_db.sql
9. Run create_views file, with: source create_views.sql
10. Run insert_data file, with: source insert_data.sql
11. Exit MYSQL command line
12. In forum directory run index,js, to do this enter: node index.js
13. Alternatively, use another node module for keeping your app running, like node.js forever

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
