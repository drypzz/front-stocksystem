import React, { Component } from 'react';
import styles from './style.module.css';

export default class CategoryForm extends Component {

   constructor(props) {
      super(props);
      this.state = {
         name: '',
         error: null,
         success: null,
      };
   }

   componentDidUpdate(prevProps) {
      if (this.props.show && !prevProps.show) {
         this.setState({ name: '', error: null, success: null });
      }
   }

   handleSubmit = async (e) => {
      e.preventDefault();
      this.setState({ error: null, success: null });
      const { name } = this.state;

      if (!name.trim()) {
         this.setState({ error: 'O nome da categoria é obrigatório.' });
         return;
      }

      try {
         console.log('Cadastrando categoria:', { name });
         
         this.setState({ success: `Categoria "${name}" cadastrada!` });
         this.setState({ name: '' });

         if (this.props.onSuccess) {
         this.props.onSuccess();
         }
         
      } catch (err) {
         this.setState({ error: 'Falha ao cadastrar categoria.' });
      }
   };

   render() {
      const { name, error, success } = this.state;
      return (
         <form className={styles.form} onSubmit={this.handleSubmit} style={{minHeight: 0}}>
            <h2 className={styles.title}>Nova Categoria</h2>
            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.success}>{success}</div>}
            <div className={styles.inputGroup}>
               <label htmlFor="categoryName">Nome da Categoria</label>
               <input
                  type="text"
                  id="categoryName"
                  value={name}
                  onChange={(e) => this.setState({ name: e.target.value })}
                  placeholder="Ex: Eletrônicos"
               />
            </div>
            <button type="submit" className={styles.button}>Cadastrar</button>
         </form>
      );
   }
}
