import axios from 'src/axios/axios';
import { useNavigate } from 'react-router-dom';
const useRefreshToken = () => {
    const navigate = useNavigate();
    const refresh = async () => {
        try {
            const response = await axios.get('/api/token/refresh', {
                headers: { Authorization: 'Bearer ' + localStorage.getItem('RefreshToken') },
            });

            localStorage.setItem('AccessToken', 'Bearer ' + response?.data?.access_token);
            localStorage.setItem('RefreshToken', response?.data?.refresh_token);
            return response?.data?.access_token;
        } catch (error) {
            navigate('/login', { replace: true });
            localStorage.clear();
        }
    };
    return refresh;
};

export default useRefreshToken;
