import { API_END_POINT } from '@/config';
import { OAUTH_CODE_SEP } from '@/util/constant';
import api from '@/lib/api';

const model = {
  handleMetaFetch: async () => {
    const userId = localStorage.getItem('userId');

    const { result } = await api.requestJSON(
      `${API_END_POINT}/payment/?userId=${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const state = {
      data: [],
    };
    Object.keys(result).forEach((key) => {
      const payment = result[key];
      state.data.push({
        kind: payment.method,
        paymentColor: payment.color,
      });
    });
    const e = {
      state,
      key: 'payment',
    };
    return e;
  },
  handleGithubLogin: async () => {
    const { search } = window.location;
    const code = search.split(OAUTH_CODE_SEP)[1];
    const data = { code };
    const { result } = await api.requestJSON(
      `${API_END_POINT}/users/githubLogin`,
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const e = {
      state: result,
      key: 'user',
    };
    localStorage.setItem('avatar', result.avatar);
    localStorage.setItem('nickname', result.nickname);
    localStorage.setItem('userId', result.userId);
    window.history.replaceState({}, '', '/');
    return e;
  },
  handleDemoLogin: async () => {
    const state = {
      userId: 2,
      nickname: 'sshrik',
      avatar: 'https://avatars.githubusercontent.com/u/20200204?v=4',
    };
    localStorage.setItem('nickname', state.nickname);
    localStorage.setItem('userId', state.userId);
    localStorage.setItem('avatar', state.avatar);

    await api.requestJSON(`${API_END_POINT}/users/demo`, {
      method: 'POST',
      body: JSON.stringify(state),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const e = {
      state,
      key: 'user',
    };

    return e;
  },
};
export default model;
