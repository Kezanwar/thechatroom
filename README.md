# The Chatroom

A live chatroom built with Vanilla JS and Firebase Firestore. 

Making this project from scratch really pushed my development skills, particularly my JS and noSQL Database knowledge. I also found my ability to consume and comprehend developer documentation and turn it into practice improved massively. 

The project highlighted the benefits of using a front end framework such as React which uses a declarative approach, as progressing this Vanilla JS web app further  than where it is currently would be challenging and unconventional in terms of architecture, organisation and time. This is due to the imperative nature of this particular approach using Vanilla JS.

Another highlight is the benefits of using a back end as a service such as Firebase, a serverless structure is ideal for an application of this size and in turn allowed me to hit the ground running from a development standpoint.

Notes about the project: 

1: Anyone can join
2: The chat doesnt save locally
3: Messages are stored in the DB but chat log is lost when logged out or UI is closed.
4: The current presence management functionality doesn't handle idle for too long users. Only way of logging out is clicking log out or firing the beforeunload event on certain browsers.

You can view the project here! https://thechatroom-kez.web.app/

![image](https://user-images.githubusercontent.com/70656399/128202492-65b5fd23-6130-474e-9e01-253a6d45e38e.png)
