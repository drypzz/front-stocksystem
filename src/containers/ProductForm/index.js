import React, { Component } from 'react';
import styles from './style.module.css';

const mockCategories = [
   { id: 1, name: 'Eletrônicos' },
   { id: 2, name: 'Móveis' },
   { id: 3, name: 'Periféricos' },
   { id: 4, name: 'Livros' },
];

export default class ProductForm extends Component {

   constructor(props) {
      super(props);
      this.initialState = {
         product: {
         name: '',
         description: '',
         price: '',
         quantity: '',
         categoryId: '',
         },
         categories: [],
         isLoadingCategories: true,
         error: null,
         success: null,
      };
      this.state = { ...this.initialState };
   }

   componentDidMount() {
      this.fetchCategories();
   }

   componentDidUpdate(prevProps) {
      if (this.props.show && !prevProps.show) {
         this.setState({ ...this.initialState });
         this.fetchCategories();
      }
   }

   fetchCategories = () => {
      this.setState({ isLoadingCategories: true });
      setTimeout(() => {
         // Em um caso real, seria:
         // try {
         //   const response = await fetch('/api/categories');
         //   const data = await response.json();
         //   this.setState({ categories: data, isLoadingCategories: false });
         // } catch(err) { ... }
         this.setState({ categories: mockCategories, isLoadingCategories: false });
      }, 500);
   };

   handleChange = (e) => {
      const { name, value } = e.target;
      this.setState((prevState) => ({
         product: {
         ...prevState.product,
         [name]: value,
         },
      }));
   };

   handleSubmit = async (e) => {
      e.preventDefault();
      this.setState({ error: null, success: null });
      const { product } = this.state;

      if (!product.name || !product.price || !product.quantity || !product.categoryId) {
         this.setState({ error: 'Preencha todos os campos obrigatórios (*).' });
         return;
      }

      try {
         console.log('Cadastrando produto:', product);
         // const response = await fetch('/api/products', { method: 'POST', ... });

         this.setState({ success: `Produto "${product.name}" cadastrado com sucesso!` });
         this.setState({ product: this.initialState.product });

         if (this.props.onSuccess) {
         this.props.onSuccess();
         }
      } catch (err) {
         this.setState({ error: 'Falha ao cadastrar produto.' });
      }
   };

   render() {
      const { product, categories, isLoadingCategories, error, success } = this.state;

      return (
         <form className={styles.form} onSubmit={this.handleSubmit}>
         <h2 className={styles.title}>Novo Produto</h2>

         {error && <div className={styles.error}>{error}</div>}
         {success && <div className={styles.success}>{success}</div>}

         <div className={styles.inputGroup}>
            <label htmlFor="name">Nome do Produto *</label>
            <input type="text" id="name" name="name" value={product.name} onChange={this.handleChange} />
         </div>

         <div className={styles.inputGroup}>
            <label htmlFor="description">Descrição</label>
            <textarea id="description" name="description" value={product.description} onChange={this.handleChange} rows="3"></textarea>
         </div>

         <div className={styles.inputGroup}>
            <label htmlFor="price">Preço *</label>
            <input type="number" id="price" name="price" value={product.price} onChange={this.handleChange} step="0.01" placeholder="Ex: 19.99" />
         </div>

         <div className={styles.inputGroup}>
            <label htmlFor="quantity">Quantidade em Estoque *</label>
            <input type="number" id="quantity" name="quantity" value={product.quantity} onChange={this.handleChange} />
         </div>
         
         <div className={styles.inputGroup}>
               <label htmlFor="categoryId">Categoria *</label>
               <select id="categoryId" name="categoryId" value={product.categoryId} onChange={this.handleChange}>
                  <option value="" disabled>
                     {isLoadingCategories ? 'Carregando...' : 'Selecione uma categoria'}
                  </option>
                  {!isLoadingCategories && categories.map(cat => (
                     <option key={cat.id} value={cat.id}>
                           {cat.name}
                     </option>
                  ))}
               </select>
         </div>

         <button type="submit" className={styles.button}>Cadastrar Produto</button>
         </form>
      );
   }
}