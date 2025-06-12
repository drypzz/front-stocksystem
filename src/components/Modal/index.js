import React, { Component } from 'react';

import styles from './style.module.css';

export default class Modal extends Component {
   render() {
      if (!this.props.show) {
         return null;
      }

      return (
         <div className={styles.container} onClick={this.props.onClose}>
            <div className={styles.content} onClick={e => e.stopPropagation()}>
               <button className={styles.closeButton} onClick={this.props.onClose}>
                  &times;
               </button>
               {this.props.children}
            </div>
         </div>
      );
   }
}