# Project: Viktig Backend

This README document guides you through setting up your local development environment for the backend of Viktig project.
Pre-setup

Before setting up the MySQL database, you need to clone the repository, set the Node.js version, and install the dependencies:
1. Clone the repository

Clone the repository using the following command:

```bash
git clone git@github.com:Timxyx/Diplomarbeit.git
```
2. Set Node.js version

Ensure that you're using the correct version of Node.js with nvm:

```bash
nvm use
```
3. Install dependencies

Install the necessary dependencies using yarn:

```bash
yarn
```
Step 1: Setting up MySQL Database

After the pre-setup is complete, follow these steps to setup your MySQL database:
1. Access MySQL shell

```bash
mysql -u root
# OR in case of access issues
sudo mysql -u root
```
2. Create new MySQL user

Substitute <your_username> with your chosen MySQL username:

```sql
CREATE USER '<your_username>';
```
3. Create the 'viktig' database

```sql
CREATE DATABASE viktig;
```
4. Grant privileges

```sql
GRANT ALL PRIVILEGES ON viktig.* TO '<your_username>'@'%';
```

5. Set password for new user

Set the password for your user by replacing <your_password>:


```sql
ALTER USER '<your_username>'@'%' IDENTIFIED BY '<your_password>';
```
6. Flush privileges

```sql
FLUSH PRIVILEGES;
```
7. Verify the creation of the database

```sql
SHOW DATABASES;
```
8. Update Environment Variables

Update your .env file as follows:

```makefile
PORT=3306
HOST=127.0.0.1
DB_USER=<your_username>
PASSWORD=<your_password>
```
Note: Ensure .env is added to your .gitignore file to prevent accidental exposure.

After following these steps, the backend application should be ready to connect to your MySQL server.


### The users you want to create should be entered in the users.json following the same syntax as the example users.


And to run it:

```bash
yarn dev
```


# License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.