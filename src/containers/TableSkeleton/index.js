import React, { Component } from "react";

import styles from "./style.module.css";

export default class TableSkeleton extends Component {
    static defaultProps = {
        rows: 3,
        columns: [{ width: "100%" }],
    };

    render() {
        const { rows, columns } = this.props;

        const skeletonRows = [...Array(rows)].map((_, rowIndex) => (
            <tr key={`skeleton-row-${rowIndex}`} className={styles.skeletonRow}>
                {columns.map((col, colIndex) => (
                    <td key={`skeleton-col-${colIndex}`}>
                        <div
                            className={styles.skeletonText}
                            style={{ width: col.width || "80%" }}
                        >
                        </div>
                    </td>
                ))}
            </tr>
        ));

        return <>{skeletonRows}</>;
    }
};