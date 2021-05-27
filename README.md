### TestCafe Assignment

### Requirements

npm install and start, `devices-clientapp` and `devicesTask_serverApp` found on URLs below
- https://github.com/Yastrenky/devices-clientapp
- https://github.com/NinjaRMM/devicesTask_serverApp

```
yarn install
make test
```

### Test Output
```
yarn run v1.21.1
$ node_modules/testcafe/bin/testcafe-with-v8-flag-filter.js chrome test.js
 Running tests in:
 - Chrome 90.0.4430.212 / Linux 0.0

 Test Device List Page
 ✓ Test correct display of name, type, capacity of a device
 ✓ Add a device and check if it is visible with correct data
 ✓ Rename first device and verify modified device has new name
 ✓ Delete last element and verify element is no longer visible
 ✓ Create a new element, delete it and verify element is no longer visible


 5 passed (19s)
Done in 25.94s.
```
### Notes
- I chose to use axios for its ease of use.
- I didn't want to install testcafe globally, so am using one from node_modules in my package json target.
