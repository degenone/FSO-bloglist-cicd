import axios from 'axios';
const URL = '/api/login';

const login = async (creds) => {
    const resp = await axios.post(URL, creds);
    return resp.data;
};

export default { login };
