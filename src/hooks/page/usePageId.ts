import { useRouter } from 'next/router';

const usePageId = (): string => {
  const { query, route } = useRouter();
  const about = route === '/about' ? 'about' : undefined;
  const page = (query.page as string) || about || 'home';

  return page;
};

export default usePageId;
