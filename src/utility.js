import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const deviceListLength = async () => {
  const devicesPath = `${API_URL}/devices`;
  const { data: listOfDevices } = await axios.get(devicesPath);
  const deviceItemsLength = listOfDevices.length;
  return deviceItemsLength;
};

export default deviceListLength;
