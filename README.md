# Setup
- Run `npm i`
- run `firebase init firestore`
- run `firebase init functions`
- Replace "<projectId>" in source files with your project name

# Running
- run ` firebase emulators:start -P <projectId> --only firestore`
- Run tests (`npm run test`). 
	- The "Write Item v1" test should pass, while the "Write Item V2" test should fail when calling the wrapped function