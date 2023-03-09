import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, getUser } from 'stores/user';
import { RootState } from 'stores';

const useUser = (): User => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!user.name) {
      dispatch(getUser('tomburgs'));
    }
  }, [dispatch, user.name]);

  return user;
};

export default useUser;
