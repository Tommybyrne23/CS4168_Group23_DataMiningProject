## New steps for setting up the Database

Assuming you guys have ran the others underneath

When you pull this to new folder do:

`npm install express`

then
`npm install --save-dev concurrently`

And then should run with 
`npm run dev`
## Installation for project

Make sure Visual Studio Code is closed before continuing

You want to first check to see if you have NodeJS (You may need to uninstall for this process.)

Also ensure that you have chocolatey uninstalled (Open PowerShell as admin and run this command: **Remove-Item -Recurse -Force C:\ProgramData\chocolatey** )

Once done you can follow this this path:

You want to install NODE.JS (Run node-v24.14.1-x64 WINDOWS ONLY)
click on next until you see a tick box, ENSURE TO TICK "Automatically ..... Install Choclatey" when running this app.

Now open VS Code.

Open a Terminal in the project and run the following >
  
  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  
IF npm did not work:
Open PowerShell as an Administrator
Type in the following code: **Set-ExecutionPolicy RemoteSigned -Scope CurrentUser**

Close VS Code and Open it again.
Run the code again and it should work.

## SPECIFICATION REQUIREMENTS:
**Functional Requirements:**

**FR-01 (Authentication):** The system shall allow users to login / register using an email and password, then log out and log back in at any time to see favourites.

**FR-02 (Navigation):** The system shall allow users to scroll through a map to see what buildings / services are available in the area. Map should be easy to read and understand with colour coded pins to differentiate the services.

**FR-03 (Search):** The system shall allow users to search for rooms / buildings / Services to find relevant information about them. When you search for a specific room you should be met with details for that specific rooms. 

**FR-04 (View):** The system shall allow users to filter the map by options like “Food and Drink” or “Buildings” to find any related information much easier. 

**FR-05 (Saving):** The system shall allow users to favorite locations so they can navigate back much easier after logging in.

**Non-Functional Requirements:** 

**NFR-01 (Performance):** API Response time must be reasonable, no longer than 150ms 

**NFR-02 (Security):** Authentication should include Captcha 

**NFR-03 (UI/UX):** The website must be fully responsive and easy to understand.

( We had a teammate who is not participating so we are short on more requirements. such as route generation to guide the user to a room/building/service. And also the deployment hence why you have to do all of this, sorry D:)
