import React from 'react';

import styles from './style.module.css';

export const TableSkeleton = ({ rows = 3, columns = [{ width: "100%" }] }) => {
    const skeletonRows = [...Array(rows)].map((_, rowIndex) => (
        <tr key={`skeleton-row-${rowIndex}`} className={styles.skeletonRow}>
            {columns.map((col, colIndex) => (
                <td key={`skeleton-col-${colIndex}`}>
                    <div className={styles.skeletonLine} style={{ width: col.width || "80%", height: '20px' }} />
                </td>
            ))}
        </tr>
    ));
    return <>{skeletonRows}</>;
};

export const ProductCardSkeleton = () => {
    return (
        <div className={styles.skeletonCard}>
            <div className={styles.skeletonCardHeader}>
                <div className={styles.skeletonLine} style={{ width: '60%', height: '24px' }} />
                <div className={styles.skeletonLine} style={{ width: '80px', height: '20px', borderRadius: '20px' }} />
            </div>
            <div className={styles.skeletonLine} style={{ height: '16px', marginBottom: '0.75rem' }} />
            <div className={styles.skeletonLine} style={{ height: '16px', width: '80%' }} />
            <div className={styles.skeletonCardFooter}>
                <div className={styles.skeletonLine} style={{ width: '100px', height: '22px' }} />
                <div className={styles.skeletonLine} style={{ width: '80px', height: '18px' }} />
            </div>
            <div className={styles.skeletonActions}>
                <div className={styles.skeletonLine} style={{ width: '130px', height: '40px' }} />
            </div>
        </div>
    );
};

export const OrderDetailSkeleton = () => {
    return (
        <>
            <header className={styles.skeletonPageHeader}>
                <div className={styles.skeletonLine} style={{ width: '180px', height: '20px' }} />
                <div className={styles.skeletonLine} style={{ width: '40%', height: '32px' }} />
            </header>
            <div className={styles.skeletonDetailCard}>
                <section className={styles.skeletonOrderSummary}>
                    <div className={styles.skeletonLine} style={{ width: '120px', height: '24px' }} />
                    <div className={styles.skeletonLine} style={{ width: '150px', height: '24px' }} />
                    <div className={styles.skeletonLine} style={{ width: '140px', height: '24px' }} />
                </section>
                <section className={styles.skeletonProductList}>
                    <div className={styles.skeletonLine} style={{ width: '100px', height: '22px', marginBottom: '1.5rem' }} />

                    {[...Array(3)].map((_, index) => (
                        <div key={index} className={styles.skeletonProductItem}>
                            <div className={styles.skeletonProductInfo}>
                                <div className={styles.skeletonLine} style={{ width: '40px', height: '20px' }} />
                                <div className={styles.skeletonLine} style={{ width: '200px', height: '20px' }} />
                            </div>
                            <div className={styles.skeletonLine} style={{ width: '80px', height: '20px' }} />
                        </div>
                    ))}
                </section>
                <footer className={styles.skeletonOrderTotal}>
                    <div className={styles.skeletonLine} style={{ width: '120px', height: '24px' }} />
                    <div className={styles.skeletonLine} style={{ width: '150px', height: '30px' }} />
                </footer>
            </div>
        </>
    );
};

export const OrderCardSkeleton = () => {
    return (
        <div className={styles.skeletonOrderCard}>
            <header className={styles.skeletonOrderHeader}>
                <div className={styles.skeletonOrderInfoGroup}>
                    <div className={styles.skeletonLine} style={{ width: '250px', height: '20px' }} />
                </div>
                <div className={styles.skeletonOrderActionsGroup}>
                    <div className={styles.skeletonLine} style={{ width: '110px', height: '28px', borderRadius: '999px' }} />
                    <div className={styles.skeletonLine} style={{ width: '24px', height: '24px', borderRadius: '4px' }} />
                </div>
            </header>
        </div>
    );
};

export const CartSkeleton = () => {
    return (
        <>
            <header className={styles.skeletonPageHeader}>
                <div className={styles.skeletonLine} style={{ width: '40%', height: '32px' }} />
                <div className={styles.skeletonLine} style={{ width: '200px', height: '20px' }} />
            </header>
            <div className={styles.skeletonCartGrid}>
                <section>
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className={styles.skeletonCartItem}>
                            <div className={styles.skeletonCartItemDetails}>
                                <div className={styles.skeletonLine} style={{ width: '70%', height: '22px' }} />
                                <div className={styles.skeletonLine} style={{ width: '100px', height: '18px', marginTop: '0.5rem' }} />
                            </div>
                            <div className={styles.skeletonCartItemActions}>
                                <div className={styles.skeletonLine} style={{ width: '120px', height: '40px' }} />
                                <div className={styles.skeletonLine} style={{ width: '40px', height: '40px' }} />
                            </div>
                        </div>
                    ))}
                </section>
                <aside className={styles.skeletonCartSummary}>
                    <div className={styles.skeletonLine} style={{ width: '80%', height: '28px', marginBottom: '1.5rem' }} />
                    <div className={styles.skeletonLine} style={{ height: '20px', marginBottom: '1rem' }} />
                    <div className={styles.skeletonLine} style={{ height: '20px', marginBottom: '2rem' }} />
                    <div className={styles.skeletonLine} style={{ height: '40px', marginTop: '1rem' }} />
                    <div className={styles.skeletonLine} style={{ height: '50px', marginTop: '1.5rem' }} />
                </aside>
            </div>
        </>
    );
};

export const ProfileSkeleton = () => {
    return (
        <>
            <header className={styles.skeletonPageHeader} style={{ marginBottom: '2.5rem' }}>
                <div className={styles.skeletonLine} style={{ width: '40%', height: '36px' }} />
            </header>
            <div className={styles.skeletonProfileLayout}>
                <aside className={styles.skeletonProfileSidebar}>
                    <div className={styles.skeletonAvatar} />
                    <div className={styles.skeletonLine} style={{ width: '80%', height: '24px' }} />
                    <div className={styles.skeletonLine} style={{ width: '100%', height: '20px' }} />
                </aside>
                <main className={styles.skeletonProfileMain}>
                    <div className={styles.skeletonSectionCard} />
                    <div className={styles.skeletonSectionCard} />
                </main>
            </div>
        </>
    );
};

export const PaymentSkeleton = () => (
    <div className={styles.skeletonPaymentWrapper}>
        <div className={styles.skeletonLine} style={{ width: '56px', height: '56px', borderRadius: '50%', marginBottom: '1rem' }} />
        <div className={styles.skeletonLine} style={{ width: '70%', height: '28px', marginBottom: '1rem' }} />
        <div className={styles.skeletonLine} style={{ width: '50%', height: '36px', marginBottom: '1.5rem' }} />
        <div className={styles.skeletonLine} style={{ width: '85%', height: '16px', marginBottom: '1.5rem' }} />
        <div className={styles.skeletonQrWrapper}>
            <div className={styles.skeletonLine} style={{ width: '250px', height: '250px', borderRadius: '6px' }} />
        </div>
        <div className={styles.skeletonCopyContainer}>
            <div className={styles.skeletonLine} style={{ flexGrow: 1, height: '45px' }} />
            <div className={styles.skeletonLine} style={{ width: '48px', height: '45px', borderRadius: '0 6px 6px 0' }} />
        </div>
        <div className={styles.skeletonLine} style={{ width: '60%', height: '12px' }} />
    </div>
);