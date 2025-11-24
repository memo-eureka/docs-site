import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import Lottie from 'react-lottie-player';
import animationData from '@site/static/img/animation.json'; // Lottie JSON 경로

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div
        className="container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', // 수평 중앙
          justifyContent: 'center', // 수직 중앙
          textAlign: 'center',     // 내부 텍스트 중앙
          minHeight: '80vh',       // 화면의 거의 중앙에 위치
        }}
      >
        <Heading as="h1" className="hero__title">
          <Lottie
            loop
            animationData={animationData}
            play
            style={{ width: 500, height: 500 }}
          />
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        {/* <HomepageFeatures /> */}
      </main>
    </Layout>
  );
}
