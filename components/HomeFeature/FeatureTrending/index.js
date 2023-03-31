import { Card } from "antd";
import Image from "next/image";
import Link from "next/link";
import styles from "./style.module.scss";

const FeatureTrending = ({ rankingCollection }) => {
  const listTrending = rankingCollection.map((item, index) => {
    if (index < 8) {
      return (
        <div key={index} className="col-xl-3 col-12 col-lg-4 mb-5 col-md-6">
          <Link href={`/collection/${item.id}`}>
            <a className={styles.trendingItem}>
              <Card
                hoverable
                cover={
                  <Image
                    quality="50"
                    layout="fill"
                    alt={item.cover_thumb_url}
                    src={item.cover_thumb_url}
                  />
                }
              >
                <div className={styles.trendingItemContent}>
                  <div className={styles.avatar}>
                    <Image
                      quality="50"
                      layout="fill"
                      src={item.logo_thumb_url}
                      alt={item.logo_thumb_url}
                    />
                  </div>
                  <h3 className={styles.name}>{item.name}</h3>
                  <p className={styles.description}>{item.description}</p>
                </div>
              </Card>
            </a>
          </Link>
        </div>
      );
    } else return "";
  });

  return (
    <div className={`container ${styles.trendingContainer}`}>
      <div className={styles.headingSection}>
        <h2 className={styles.titleHome}>Trending</h2>
        <Link href="/rankings">
          <a className={styles.viewAll}>View all</a>
        </Link>
      </div>

      <div className={`${styles.slider} row`}>{listTrending}</div>
    </div>
  );
};

export default FeatureTrending;
