import { Selector, ClientFunction } from 'testcafe';
import {
  API_URL,
  APP_URL,
  devicesPath,
  updateFirstDeviceData,
  specialListItemData,
} from './constants';
import {
  getDeviceListLength,
  getDevices,
  updateDevice,
  deleteDevice,
  createDevice,
} from './utility';

// eslint-disable-next-line template-tag-spacing, no-undef, no-unused-expressions
fixture `Test Device List Page`
// eslint-disable-next-line template-tag-spacing
  .page `${APP_URL}`;

// Test 1
// Make an API call to retrieve the list of devices. Use the list of devices to check the
// elements are visible in the DOM. Check the name, type and capacity of each element of
// the list using the class names and make sure they are correctly displayed.
test('Test correct display of name, type, capacity of a device', async (t) => {
  const listOfDevices = await getDevices();
  const deviceInfo = listOfDevices.map(async (device) => {
    await t.expect(Selector('div.device-info span.device-name').withText(device.system_name).exists).eql(true);
    await t.expect(Selector('div.device-info span.device-type').withText(device.type).exists).eql(true);
    await t.expect(Selector('div.device-info span.device-capacity').withText(device.hdd_capacity).exists).eql(true);
  });
  await Promise.all(deviceInfo);
  const editDeleteBtns = listOfDevices.map(async (device, index) => {
    await t.expect(Selector('div.device-options a.device-edit').nth(index).withText('EDIT').exists).eql(true);
    await t.expect(Selector('div.device-options button.device-remove').nth(index).withText('REMOVE').exists).eql(true);
  });
  await Promise.all(editDeleteBtns);
});

// Test 2
// Verify that devices can be created properly using the UI.
// Verify the new device is now visible. Check name, type and capacity are visible and
// correctly displayed to the user.
test('Add a device and check if it is visible with correct data', async (t) => {
  // Test Data
  const dName = 'Mani System';
  const dType = 'MAC';
  const dCapacity = '15';

  // Entry Values Selectors
  const systemName = Selector('input#system_name');
  const hddCapacity = Selector('input#hdd_capacity');
  const typeSelect = Selector('#type');
  const typeOption = typeSelect.find('option');
  const saveButton = Selector('button.submitButton');

  // Create a device
  const createDeviceButton = Selector('.submitButton').withText('ADD DEVICE');
  await t.click(createDeviceButton);

  // Confirm that we are on the Add Device Page
  const getLocation = ClientFunction(() => document.location.href);
  await t.expect(getLocation()).contains('http://localhost:3001/devices/add');

  // Enter values
  await t
    .typeText(systemName, dName)
    .click(typeSelect)
    .click(typeOption.withText(dType))
    .typeText(hddCapacity, dCapacity)
    .click(saveButton);

  // Confirm existence of Add Device button at the top
  await t.expect(Selector('.submitButton').withText('ADD DEVICE').exists).eql(true);

  // Verify new device is visible and check its data
  await t.expect(Selector('div.device-info span.device-name').withText(dName).exists).eql(true);
  await t.expect(Selector('div.device-info span.device-type').withText(dType).exists).eql(true);
  await t.expect(Selector('div.device-info span.device-capacity').withText(dCapacity).exists).eql(true);
});

// Test 3
// Make an API call that renames the first device of the list to “Renamed Device”.
// Reload the page and verify the modified device has the new name.
test('Rename first device and verify modified device has new name', async (t) => {
  const listOfDevices = await getDevices();
  const firstDeviceID = listOfDevices[0].id;
  const firstDevicePath = `${API_URL}/devices/${firstDeviceID}`;

  await updateDevice(firstDevicePath, updateFirstDeviceData);

  // Reload Page
  await t.eval(() => window.location.reload(true));
  await t.wait(2000);

  // Confirm existence of record
  await t.expect(Selector('div.device-info span.device-name').withText(updateFirstDeviceData.system_name).exists).eql(true);
  await t.expect(Selector('div.device-info span.device-type').withText(updateFirstDeviceData.type).exists).eql(true);
  await t.expect(Selector('div.device-info span.device-capacity').withText(updateFirstDeviceData.hdd_capacity).exists).eql(true);
});

// Test 4
// Make an API call that deletes the last element of the list.
// Reload the page and verify the element is no longer visible and it doesn’t exist in the
// DOM.
test('Delete last element and verify element is no longer visible', async (t) => {
  const listOfDevices = await getDevices();
  const deviceItemsPreDeletion = await getDeviceListLength();

  const lastDevice = listOfDevices[deviceItemsPreDeletion - 1];
  const lastDevicePath = `${API_URL}/devices/${lastDevice.id}`;

  // Delete last ID
  await deleteDevice(lastDevicePath);

  // Reload Page
  await t.eval(() => window.location.reload(true));
  await t.wait(2000);

  // Check Device list count (it should not be same)
  const deviceItemsPostDeletion = await getDeviceListLength();
  await t.expect(deviceItemsPreDeletion).notEql(deviceItemsPostDeletion);

  // Check Page and the element should not be there
  await t.expect(Selector('div.device-info span.device-name').withText(lastDevice.system_name).exists).eql(false);
});

test('Create a new element, delete it and verify element is no longer visible', async (t) => {
  // Create a new Element
  const newListElement = await createDevice(devicesPath, specialListItemData);

  // Reload Page
  await t.eval(() => window.location.reload(true));
  await t.wait(2000);

  // Delete item
  const deleteDevicePath = `${API_URL}/devices/${newListElement.id}`;
  await deleteDevice(deleteDevicePath);

  // Reload Page
  await t.eval(() => window.location.reload(true));
  await t.wait(2000);

  // Check Page and the element should not be there
  await t.expect(Selector('div.device-info span.device-name').withText(newListElement.system_name).exists).notOk();
});
