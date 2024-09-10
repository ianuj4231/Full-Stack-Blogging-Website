import { atom, selector } from 'recoil';
import axios from 'axios';
import { backend_url } from '../config';

export const emailState = atom({
  key: 'emailState',
  default: '',
});

export const passwordState = atom({
  key: 'passwordState',
  default: '',
});

export const nameState = atom({
  key: 'nameState',
  default: '',
});

export const allBlogsState = atom({
  key: 'allBlogsState',
  default: [],
});

export const allBlogsSelector = selector({
  key: 'allBlogsSelector',
  get: async () => {
    try {
      const response = await axios.get(`${backend_url}/api/v1/user/blog/bulk`);
      // console.log(response.data);      
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch blogs');
    }
  },
});

export const blogState = atom({
  key: 'blogState',
  default: { title: "", content: "" },
});



export const postsofoneState = atom({
  key: 'postsofoneState', 
  default: [],
});