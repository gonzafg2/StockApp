<template>
  <div class="q-pa-md">
    <h4 class="flex flex-center">Stock de Productos</h4>
    <div class="flex flex-center q-pa-md q-gutter-lg">
      <q-btn unelevated rounded color="primary" label="Entrada" size="lg" />
      <q-btn unelevated rounded color="secondary" label="Salida" size="lg" />
    </div>
    <q-table
      title="Inventario"
      color="primary"
      :data="data"
      :columns="columns"
      :loading="loading"
      row-key="item"
    >
      <template v-slot:loading v-show="data != []">
        <q-inner-loading showing color="primary" />
      </template>
    </q-table>
  </div>
</template>

<script>
import { db } from "../boot/firebase";

export default {
  data () {
    return {
      loading: false,
      columns: [
        {
          name: 'item',
          required: true,
          label: 'Item',
          align: 'left',
          field: row => row.item,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'codigo', align: 'center', label: 'Código', field: 'codigo', sortable: true },
        { name: 'stock', label: 'Stock', field: 'stock', sortable: true },
        { name: 'unidad', label: 'Unidad', field: 'unidad', sortable: true },
        { name: 'tipo', align: 'center', label: 'Tipo', field: 'tipo', sortable: true },
        { name: 'lugar',align: 'center', label: 'Lugar', field: 'lugar', sortable: true },
        { name: 'minimo', label: 'Stock Mínimo', field: 'minimo' }
      ],

      data: [
        // {
        //   name: 'Frozen Yogurt',
        //   calories: 159,
        //   fat: 6.0,
        //   carbs: 24,
        //   protein: 4.0,
        //   sodium: 87,
        //   calcium: '14%',
        //   iron: '1%'
        // },
      ]
    }
  },
  created(){
    this.listarInOut();
  },

  methods: {
    async listarInOut(){
      try {
        const query = await db.collection('productos').get();
        
        query.forEach(elemento => {

          let producto = {
            id: elemento.id,
            item: elemento.data().item,
            stock: elemento.data().stock,
            codigo: elemento.data().codigo,
            unidad: elemento.data().unidad,
            lugar: elemento.data().lugar,
            tipo: elemento.data().tipo,
            minimo: elemento.data().minimo
          }
          this.data.push(producto);
          console.log(producto);

        });
        
      } catch (error) {
        console.log(error);
      }
    },
  }
}
</script>