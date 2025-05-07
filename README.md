# event-updater
A custom React Component will import data from an external API within Adalo to match external event updates against internal events and update specified data points in the Adalo database. This component is replacing a listener with a button to fetch and update any changes in the data.  

Adalo Event Updater

This component allows a user to take data from an external API (Jobber or HSP), identify matching events that exist in the internal database, and make updates to the internal collection based on changes from the external API.
The interaction for the component is a button that fetches the external data, internal collection, and date parameters to match and update events accordingly.

Motivation The motivation behind this component is that, without a true backend or any automated tools, there was no way to fetch, identify the matches, and update this data in Adalo. One solution was to allow the user to click a button to perform this function whenever they wanted to fetch data.

This component has not been published to the marketplace at the time of this writting so the only way to use it is private.

Running private

Prerequisites

NodeJS Yarn Linux/macOS/WSL Clone the repository and run $ cd my-component $ yarn # install dependencies $ npx adalo login # login to your adalo account $ npx adalo dev # start the development server $ npx adalo publish # deploy the component privately to your account

How is this component used

Once the component is installed, you can drag and drop the EventUpdater button on the app screen and configure it.

-Full Guide coming

Version History 1.0.0 - initial commit


**Screenshots**

![Screen Shot 2025-05-07 at 9 49 13 AM](https://github.com/user-attachments/assets/eb3378a9-8b6a-411e-9eb1-708e9d831d90)

![Screen Shot 2025-05-07 at 9 49 25 AM](https://github.com/user-attachments/assets/947b5ed5-81c6-4a8d-87cd-6e791d2f0511)

![Screen Shot 2025-05-07 at 9 49 36 AM](https://github.com/user-attachments/assets/cc197be5-91fa-45e9-a530-38ccef6fb7b0)

![Screen Shot 2025-05-07 at 9 49 49 AM](https://github.com/user-attachments/assets/b5c577cf-a40f-4207-a411-ae8d12631e92)






