import Link from 'next/link';

const Index = () => (
  <div>
    <Link href="/about">
      <p>about</p>
    </Link>
    <Link href="/post?slug=something" as="/post/something"><p>hai</p></Link>
    <p>Hello Next.js</p>
  </div>
);

export default Index;