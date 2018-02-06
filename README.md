# GitHup

A Desktop Application that leverages GitHub to store your files. 

![Desktop Application](https://github.com/dannycho7/GitHup/blob/master/img/preview.png)

Note: Currently, there is a lot to do for installation. This is because I haven't spent much time on making this an accessible tool for everyone to use.

GitHup also applies AES-256 Encryption and GZIP compression to keep your files private and small. This means you can only access the files through the GitHup desktop application. There is, however, also a server to access files anywhere, but it's not easy to set up.

# Installation:

Clone the repository and install packages:
```
git clone git@github.com:dannycho7/GitHup.git
npm install
```

Create a repository that will work as your storage repository on GitHub and call the folder 'files'. Then, clone that repository into the GitHup source repository. Note: You must set up ssh access for your GitHub account.
```
cd GitHup
git clone git@github.com:__YOUR_GITHUB_USERNAME__/__GITHUB_STORAGE_REPOSITORY_NAME__.git files
```

You will need to create an environment variable file named .env. There are two variables that go inside this file: the SECRET and MONGO_URI. I recommend creating the mongo server at mlab.com. Here is a sample use case with my mlab hosted mongo server:
```
touch .env
echo "SECRET=blahblahblahsecretkeythiscanbeanything" >> .env
echo "MONGO_URI=mongodb://<DB_USERNAME>:<DB_PASSWORD>@ds123728.mlab.com:23728/githup" >> .env
```

After executing the above commands your .env file should look like this:
```
SECRET=blahblahblahsecretkeythiscanbeanything
MONGO_URI=mongodb://<DB_USERNAME>:<DB_PASSWORD>@ds123728.mlab.com:23728/githup
```

To start the application, go into the repository and type:
```
npm start
```

# Caveats:

* If you use Bash on Ubuntu on Windows, you will need to run all these commands through something like Git Bash.
	* From my experience, Bash on Ubuntu on Windows doesn't work well with the Electron.js packages. This is likely because it downloads packages for Ubuntu, which won't work well with Desktop Applications that use Windows graphics.
* This isn't polished enough to store your precious files. The program is likely to change drastically over time.

Have fun.