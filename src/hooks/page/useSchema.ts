import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'stores';
import { getSchema, Schema } from 'stores/pages';

const useSchema = (): Schema => {
  const dispatch = useDispatch();
  const { schema } = useSelector((state: RootState) => state.pages);

  useEffect(() => {
    if (!Object.keys(schema).length) {
      dispatch(getSchema());
    }
  }, [dispatch, schema]);

  return schema;
};

export default useSchema;
