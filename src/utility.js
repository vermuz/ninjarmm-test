import axios from 'axios';
import { devicesPath } from './constants';

export const getDevices = async () => {
  const { data } = await axios.get(devicesPath);
  return data;
};

export const updateDevice = async (path, updateData) => {
  const { data } = await axios.put(path, updateData);
  return data;
};

export const deleteDevice = async (path) => {
  await axios.delete(path);
};

export const createDevice = async (path, createData) => {
  const { data } = await axios.post(path, createData);
  return data;
};

export const getDeviceListLength = async () => {
  const listOfDevices = await getDevices();
  return listOfDevices.length;
};
