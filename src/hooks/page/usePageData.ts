import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'stores';
import { getPage, Page } from 'stores/pages';
import { usePageId } from 'hooks/page';

const usePageData = (): Page => {
  const dispatch = useDispatch();
  const pageId = usePageId();
  const {
    pages: { [pageId]: pageData }
  } = useSelector((state: RootState) => state.pages);

  useEffect(() => {
    if (!pageData) {
      dispatch(getPage(pageId));
    }
  }, [dispatch, pageData, pageId]);

  return pageData || {};
};

export default usePageData;
