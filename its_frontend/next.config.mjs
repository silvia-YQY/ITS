/** @type {import('next').NextConfig} */
import withLess from 'next-with-less';

export default withLess({
  lessLoaderOptions: {
    lessOptions: {
      javascriptEnabled: true,
    },
  },
});
