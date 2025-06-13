import React, { Component } from "react";

import styles from "./style.module.css";

export default class ProductCardSkeleton extends Component {
    render() {
        return (
            <div className={styles.skeletonCard}>
                <div className={styles.skeletonHeader}>
                    <div className={`${styles.skeletonLine} ${styles.skeletonTitle}`} />
                    <div className={`${styles.skeletonLine} ${styles.skeletonTag}`} />
                </div>
                <div className={`${styles.skeletonLine} ${styles.skeletonText}`} />
                <div className={`${styles.skeletonLine} ${styles.skeletonText}`} />
                <div className={styles.skeletonFooter}>
                    <div className={`${styles.skeletonLine} ${styles.skeletonPrice}`} />
                    <div className={`${styles.skeletonLine} ${styles.skeletonQty}`} />
                </div>
                <div className={styles.skeletonActions}>
                    <div className={`${styles.skeletonLine} ${styles.skeletonButton}`} />
                    <div className={`${styles.skeletonLine} ${styles.skeletonButton}`} />
                </div>
            </div>
        );
    }
};