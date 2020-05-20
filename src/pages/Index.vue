<template>
  <div class="q-pa-md">
    <h4 class="flex flex-center">Stock de Productos</h4>
    <div class="flex flex-center q-pa-md q-mb-lg q-gutter-lg">
      <q-btn
        class="q-pa-sm q-mx-md"
        unelevated
        rounded
        color="positive"
        label="Ingresar Ítem"
        size="md"
        @click="inputShowAdd"
      />
      <q-btn
        class="q-pa-sm q-mx-md"
        unelevated
        rounded
        color="primary"
        label="Entrada de Stock"
        size="md"
      />
      <q-btn
        class="q-pa-sm q-mx-md"
        unelevated
        rounded
        color="secondary"
        label="Salida de Stock"
        size="md"
      />
    </div>
    <q-table
      color="primary"
      :data="data"
      :columns="columns"
      :loading="loading"
      :filter="filter"
      :pagination.sync="pagination"
      :visible-columns="visibleColumns"
      row-key="item"
      rows-per-page-label="Ítems por página"
      selection="multiple"
      :selected.sync="selected"
    >
      <template v-slot:top>
        <img
          style="height: 50px; width: 50px"
          src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg"
        />
        <q-space />

        <div v-if="$q.screen.gt.xs" class="col flex flex-center">
          <!-- <q-toggle class="q-px-sm" v-model="visibleColumns" val="item" label="Item" /> -->
          <q-toggle
            class="q-px-sm"
            v-model="visibleColumns"
            val="codigo"
            label="Código"
          />
          <!-- <q-toggle class="q-px-sm" v-model="visibleColumns" val="stock" label="Stock" /> -->
          <q-toggle
            class="q-px-sm"
            v-model="visibleColumns"
            val="unidad"
            label="Unidad"
          />
          <q-toggle
            class="q-px-sm"
            v-model="visibleColumns"
            val="tipo"
            label="Tipo"
          />
          <q-toggle
            class="q-px-sm"
            v-model="visibleColumns"
            val="lugar"
            label="Lugar"
          />
          <q-toggle
            class="q-px-sm"
            v-model="visibleColumns"
            val="minimo"
            label="Stk. Mín."
          />
        </div>

        <q-select
          v-else
          v-model="visibleColumns"
          multiple
          borderless
          dense
          options-dense
          :display-value="$q.lang.table.columns"
          emit-value
          map-options
          :options="columns"
          option-value="name"
          style="min-width: 150px"
        />
        <q-space />

        <q-input
          borderless
          dense
          debounce="300"
          color="primary"
          v-model="filter"
          placeholder="Buscar..."
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-space />

        <q-btn
          class="q-ml-xl"
          color="negative"
          icon-right="delete_forever"
          no-caps
          @click="deleteSelected"
        />
      </template>

      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn
            color="negative"
            icon-right="delete"
            no-caps
            flat
            dense
            @click="deleteval(props.row)"
          />
        </q-td>
      </template>
      <!-- data.indexOf(props.row) -->
      <!-- <q-btn flat color="red" @click="eliminar(index)">Eliminar</q-btn> -->
    </q-table>
    <!-- <transition-group
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut">

        <div key="delete-key" class="q-mt-lg row" v-if="selected != ''">
          Ítem a ELIMINAR: 
          <ul class="q-mt-none col-6">
            <li class="col-12"><strong>{{ `Código ${selected[0].codigo} - Stock de ${selected[0].codigo} ${selected[0].unidad} - ${selected[0].item}` }}</strong></li>
          </ul>
          <q-btn
          class="col-6"
            :loading="loading1"
            :percentage="percentage1"
            color="negative"
            @click="eliminarItem(selected[0].id, selected[0].item)"
            style="width: 250px; height: 64px;"
          >
            Eliminar Registro(s)
            <template v-slot:loading>
              <q-spinner-gears class="on-left" />
              Incinerando datos...
            </template>
          </q-btn>
        </div>
      </transition-group> -->

    <div v-if="inputShow" class="q-pa-md">
      <transition-group
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <h5 key="title" class="flex flex-center">Ingreso de Productos</h5>
        <q-form key="key-form" @submit="guardarItem" @reset="limpiarItem">
          <div key="body" class="q-gutter-y-md row" style="max-width: 100%">
            <q-input
              label="Código"
              class="col-2"
              rounded
              outlined
              v-model="codigo"
              lazy-rules
              :rules="[val => !!val || 'Este campo es requerido']"
            >
              <template v-slot:append>
                <q-avatar>
                  <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg" />
                </q-avatar>
              </template>
            </q-input>
            <div key="body-1" class="flex-break q-px-md"></div>
            <q-input
              label="Item"
              class="col"
              rounded
              outlined
              v-model="item"
              lazy-rules
              :rules="[val => !!val || 'Este campo es requerido']"
            >
              <template v-slot:append>
                <q-avatar>
                  <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg" />
                </q-avatar>
              </template>
            </q-input>
            <div key="body-2" class="flex-break q-px-md"></div>
            <q-input
              label="Stock"
              class="col"
              rounded
              outlined
              v-model="stock"
              lazy-rules
              :rules="[val => !!val || 'Este campo es requerido']"
            >
              <template v-slot:append>
                <q-avatar>
                  <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg" />
                </q-avatar>
              </template>
            </q-input>
            <div key="body-3" class="flex-break q-px-md"></div>
            <q-input
              label="Unidad"
              class="col"
              rounded
              outlined
              v-model="unidad"
              lazy-rules
              :rules="[val => !!val || 'Este campo es requerido']"
            >
              <template v-slot:append>
                <q-avatar>
                  <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg" />
                </q-avatar>
              </template>
            </q-input>
          </div>

          <div
            key="body-4"
            class="q-gutter-y-md q-mt-lg row"
            style="max-width: 100%"
          >
            <q-input
              label="Tipo"
              class="col"
              rounded
              outlined
              v-model="tipo"
              lazy-rules
              :rules="[val => !!val || 'Este campo es requerido']"
            >
              <template v-slot:append>
                <q-avatar>
                  <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg" />
                </q-avatar>
              </template>
            </q-input>
            <div class="flex-break q-px-md"></div>
            <q-input
              label="Lugar"
              class="col"
              rounded
              outlined
              v-model="lugar"
              lazy-rules
              :rules="[val => !!val || 'Este campo es requerido']"
            >
              <template v-slot:append>
                <q-avatar>
                  <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg" />
                </q-avatar>
              </template>
            </q-input>
            <div class="flex-break q-px-md"></div>
            <q-input
              label="Stock Mínimo"
              class="col"
              rounded
              outlined
              v-model="minimo"
              lazy-rules
              :rules="[val => !!val || 'Este campo es requerido']"
            >
              <template v-slot:append>
                <q-avatar>
                  <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg" />
                </q-avatar>
              </template>
            </q-input>
          </div>

          <div key="body-5" class="flex flex-center q-pa-md q-gutter-lg">
            <q-btn
              type="submit"
              key="button-1"
              class="q-pa-sm q-mt-xl"
              unelevated
              rounded
              color="positive"
              label="Guardar"
              size="md"
            />
            <q-btn
              type="reset"
              key="button-2"
              class="q-pa-sm q-mt-xl"
              outline
              rounded
              color="primary"
              label="Limpiar"
              size="md"
            />
          </div>
        </q-form>
      </transition-group>
    </div>
  </div>
</template>

<script>
import { db } from "../boot/firebase";
import { QSpinnerFacebook } from "quasar";

export default {
  data() {
    return {
      loading1: false,
      percentage1: 0,
      selected: [],
      visibleColumns: [
        "item",
        "codigo",
        "lugar",
        "tipo",
        "unidad",
        "minimo",
        "stock",
        "action"
      ],
      inputShow: false,
      item: "",
      codigo: "",
      lugar: "",
      tipo: "",
      minimo: "",
      stock: "",
      unidad: "",
      loading: false,
      filter: "",
      pagination: {
        rowsPerPage: 5
      },
      columns: [
        {
          name: "item",
          required: true,
          label: "Item",
          align: "left",
          field: row => row.item,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "codigo",
          align: "center",
          label: "Código",
          field: "codigo",
          sortable: true
        },
        { name: "stock", label: "Stock", field: "stock", sortable: true },
        { name: "id", label: "ID", field: "id", sortable: true },
        { name: "unidad", label: "Unidad", field: "unidad", sortable: true },
        {
          name: "tipo",
          align: "center",
          label: "Tipo",
          field: "tipo",
          sortable: true
        },
        {
          name: "lugar",
          align: "center",
          label: "Lugar",
          field: "lugar",
          sortable: true
        },
        { name: "minimo", label: "Stock Mínimo", field: "minimo" },
        { name: "action", label: "Acciones", field: "action" }
      ],

      data: []
    };
  },
  created() {
    this.listarInOut();
  },

  methods: {
    deleteSelected() {
      let self = this;

      this.selected.filter(function(item) {
        self.data.splice(self.data.indexOf(item), 1);
        return item;
      });

      this.selected = [];
    },

    async deleteval(index) {
      // console.log(index);
      this.$q
        .dialog({
          title: "Acción Importante: Requiere Confirmación.",
          message:
            "¿Está seguro de eliminar este producto de su inventario? \n ¡Esta acción es PERMANENTE!",
          ok: {
            push: true,
            label: "Sí! Ya no es útil."
          },
          cancel: {
            push: true,
            color: "negative",
            label: "¡No!"
          },
          persistent: true
        })
        .onOk(async () => {
          try {
            this.$q.loading.show();
            // Borrar en Firebase
            let idF = index.id;
            const query = await db
              .collection("productos")
              .doc(idF)
              .delete();
            // Borrar en LocalStorage
            let indexLocal = this.data.indexOf(index);
            await this.data.splice(indexLocal, 1);

            this.$q.notify({
              message: "El producto se ha eliminado exitosamente",
              color: "negative",
              textColor: "white",
              type: "negative",
              position: "top"
            });
          } catch (error) {
            this.$q.notify({
              message: `Ha ocurrido un problema. El error es: ${error}`,
              color: "red",
              textColor: "white",
              icon: "clear"
            });
          } finally {
            this.$q.loading.hide();
          }
        });
    },

    inputShowAdd: function() {
      if (this.inputShow == false) {
        this.inputShow = true;
      } else if (this.inputShow == true) {
        this.inputShow = false;
      }
    },

    async listarInOut() {
      try {
        const spinner =
          typeof QSpinnerFacebook !== "undefined"
            ? QSpinnerFacebook // Non-UMD, imported above
            : Quasar.components.QSpinnerFacebook; // eslint-disable-line
        /* End of Codepen workaround */

        this.$q.loading.show({
          spinner,
          spinnerColor: "indigo",
          spinnerSize: 140,
          backgroundColor: "indigo",
          message: "Por favor espere. Se están cargando sus datos...",
          messageColor: "white"
        });

        const query = await db.collection("productos").get();

        await query.forEach(elemento => {
          let producto = {
            id: elemento.id,
            item: elemento.data().item,
            stock: elemento.data().stock,
            codigo: elemento.data().codigo,
            unidad: elemento.data().unidad,
            lugar: elemento.data().lugar,
            tipo: elemento.data().tipo,
            minimo: elemento.data().minimo
          };
          this.data.push(producto);
        });
      } catch (error) {
        console.log(error);
      } finally {
        this.$q.loading.hide();
      }
    },

    limpiarItem() {
      this.item = "";
      this.codigo = "";
      this.stock = "";
      this.lugar = "";
      this.tipo = "";
      this.unidad = "";
      this.minimo = "";
    },

    guardarItem() {
      this.$q
        .dialog({
          title: "Acción Importante: Requiere Confirmación.",
          message:
            "¿Está seguro de guardar este producto dentro de su inventario?",
          ok: {
            push: true,
            label: "Sí, guardar."
          },
          cancel: {
            push: true,
            color: "negative",
            label: "¡No!"
          },
          persistent: true
        })
        .onOk(async () => {
          let query = await db.collection("productos").add({
            item: this.item,
            codigo: this.codigo,
            stock: this.stock,
            lugar: this.lugar,
            tipo: this.tipo,
            unidad: this.unidad,
            minimo: this.minimo
          });
          // console.log('>>>> OK')
          await this.data.push({
            id: query.id,
            item: this.item,
            codigo: this.codigo,
            stock: this.stock,
            lugar: this.lugar,
            tipo: this.tipo,
            unidad: this.unidad,
            minimo: this.minimo
          });
          this.item = "";
          this.codigo = "";
          this.stock = "";
          this.lugar = "";
          this.tipo = "";
          this.unidad = "";
          this.minimo = "";

          this.$q.notify({
            message: "El producto se ha guardado exitosamente",
            color: "positive",
            textColor: "white",
            type: "positive",
            position: "top"
          });
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    }
  }
};
</script>
