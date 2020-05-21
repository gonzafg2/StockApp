<template>
  <div class="q-px-xl q-mx-xl">
    <!-- Título de página -->
    <h4 class="flex flex-center">Stock de Productos</h4>
    <!-- Contenedor para btns de formularios de ingreso -->
    <div class="flex flex-center q-pa-md q-mb-lg q-gutter-lg">
      <!-- Btn para desplegar formulario de ingreso de producto. -->
      <q-btn
        class="q-pa-sm q-mx-md"
        unelevated
        rounded
        color="positive"
        label="Ingresar Ítem"
        size="md"
        @click="inputShowAdd"
      >
        <!-- Tooltip para mejor indicación al usuario -->
        <q-tooltip
          anchor="top middle"
          self="bottom middle"
          transition-show="scale"
          transition-hide="scale"
        >
          Toca para desplegar el formulario de ingreso de ítem.
        </q-tooltip>
      </q-btn>
      <!-- Btn para desplegar formulario de entrada de producto. -->
      <q-btn
        class="q-pa-sm q-mx-md"
        unelevated
        rounded
        color="primary"
        label="Entrada de Stock"
        size="md"
      >
      <!-- Tooltip para mejor indicación al usuario -->
        <q-tooltip anchor="top middle" self="bottom middle" transition-show="scale" transition-hide="scale">
          Toca para desplegar el formulario de entrada de ítem.
        </q-tooltip>
      </q-btn>
      <!-- Btn para desplegar formulario de salida de producto. -->
      <q-btn
        class="q-pa-sm q-mx-md"
        unelevated
        rounded
        color="secondary"
        label="Salida de Stock"
        size="md"
      >
      <!-- Tooltip para mejor indicación al usuario -->
        <q-tooltip anchor="top middle" self="bottom middle" transition-show="scale" transition-hide="scale">
          Toca para desplegar el formulario de salida de ítem.
        </q-tooltip>
      </q-btn>
    </div>

    <!-- Tabla de Inventario de Productos -->
    <q-table
      :data="data"
      :columns="columns"
      :loading="loading"
      :filter="filter"
      :pagination.sync="pagination"
      :pagination-label="getPaginationLabel"
      :visible-columns="visibleColumns"
      :selected.sync="selected"
      :selected-rows-label="getSelectedString"
      color="primary"
      row-key="item"
      rows-per-page-label="Ítems por página"
      selection="multiple"
      binary-state-sort
    >
      <template v-slot:top>
        <!-- Ícono lateral izquierdo de la tabla de productos -->
        <q-icon
          style="font-size: 2.5rem; color: #21BA45"
          name="assignment_turned_in"
        />

        <!-- Contenedor de Toggle para mostrar u ocultar columnas -->
        <div v-if="$q.screen.gt.xs" class="col flex flex-center">
          <!-- Toggle de Columna de Unidad -->
          <q-toggle
            class="q-px-sm"
            v-model="visibleColumns"
            val="unidad"
            label="Unidad"
          />
          <!-- Toggle de Columna de Tipo -->
          <q-toggle
            class="q-px-sm"
            v-model="visibleColumns"
            val="tipo"
            label="Tipo"
          />
          <!-- Toggle de Columna de Lugar -->
          <q-toggle
            class="q-px-sm"
            v-model="visibleColumns"
            val="lugar"
            label="Lugar"
          />
          <!-- Toggle de Columna de Stock Mínimo -->
          <q-toggle
            class="q-px-sm"
            v-model="visibleColumns"
            val="minimo"
            label="Stk. Mín."
          />
        </div>

        <!-- ComboBox (Select) de columnas en versión móvil o en anchos pequeños de pantalla -->
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

        <!-- Campo de búsqueda -->
        <q-input
          dense
          debounce="300"
          color="primary"
          v-model="filter"
          placeholder="Buscar..."
        >
          <!-- Icono de campo de búsqueda -->
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <!-- Btn de exportar tabla a CSV -->
        <q-btn
          class="q-ml-lg"
          color="primary"
          icon-right="archive"
          label=""
          no-caps
          @click="exportTable"
        />

        <!-- Btn para eliminación de un barch de productos (varias filas) -->
        <q-btn
          id="btn-erase-batch"
          class="q-ml-sm"
          color="negative"
          icon-right="delete_forever"
          no-caps
          @click="deleteSelected"
        />
      </template>

      <!-- <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="desc" :props="props">
            {{ props.row.name }}
            <q-popup-edit v-model="props.row.name">
              <q-input v-model="props.row.name" dense autofocus counter />
            </q-popup-edit>
          </q-td>
          <q-td key="calories" :props="props">
            {{ props.row.calories }}
            <q-popup-edit
              v-model="props.row.calories"
              title="Update calories"
              buttons
            >
              <q-input
                type="number"
                v-model="props.row.calories"
                dense
                autofocus
              />
            </q-popup-edit>
          </q-td>
          <q-td key="fat" :props="props">
            <div class="text-pre-wrap">{{ props.row.fat }}</div>
            <q-popup-edit v-model="props.row.fat">
              <q-input
                type="textarea"
                v-model="props.row.fat"
                dense
                autofocus
              />
            </q-popup-edit>
          </q-td>
          <q-td key="carbs" :props="props">
            {{ props.row.carbs }}
            <q-popup-edit
              v-model="props.row.carbs"
              title="Update carbs"
              buttons
              persistent
            >
              <q-input
                type="number"
                v-model="props.row.carbs"
                dense
                autofocus
                hint="Use buttons to close"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="protein" :props="props">{{ props.row.protein }}</q-td>
          <q-td key="sodium" :props="props">{{ props.row.sodium }}</q-td>
          <q-td key="calcium" :props="props">{{ props.row.calcium }}</q-td>
          <q-td key="iron" :props="props">{{ props.row.iron }}</q-td>
        </q-tr>
      </template> -->

      <!-- Btn para eliminación de producto (fila) individual -->
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
    </q-table>

    <!-- Formulario de ingreso de nuevos productos -->
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
import { exportFile } from "quasar";
import Input from "../components/Input";

// Función que ayuda a la exportación a CSV
let wrapCsvValue = (val, formatFn) => {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`;
};

//variables para fecha (YYY-Mmm-D) para exportación de CSV
var dateObject = new Date();
let Day = dateObject.getDate();
let Month = dateObject.getMonth();
let month = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic"
];
let monthShort = month[Month];
let Year = dateObject.getFullYear();
let dateActual = `${Year}-${monthShort}-${Day}`;

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
  updated() {
    this.btnErase();
  },

  methods: {
    // Script para exportar tabla de ítems a archvio CSV
    exportTable() {
      // naive encoding to csv format
      const content = [this.columns.map(col => wrapCsvValue(col.label))]
        .concat(
          this.data.map(row =>
            this.columns
              .map(col =>
                wrapCsvValue(
                  typeof col.field === "function"
                    ? col.field(row)
                    : row[col.field === void 0 ? col.name : col.field],
                  col.format
                )
              )
              .join(",")
          )
        )
        .join("\r\n");

      const status = exportFile(
        // 'table-export.csv',
        `${dateActual}_Inventario.xls`,
        content,
        "text/csv"
      );

      if (status !== true) {
        this.$q.notify({
          message: "Su navegador denegó la descarga del archivo...",
          color: "negative",
          icon: "warning"
        });
      }
    },

    // Traduce línea sobre cantidad de filas en tabla de registro
    getPaginationLabel(firstRowIndex, endRowIndex, totalRowsNumber) {
      return `${firstRowIndex} - ${endRowIndex} de ${totalRowsNumber}`;
    },

    // Traduce y modifica línea inferior de tabla para selección de registros para eliminar
    getSelectedString() {
      if (this.selected.length === 0) {
        return "";
      } else if (this.selected.length === 1) {
        return `${this.selected.length} ítem${
          this.selected.length > 1 ? "s" : ""
        } seleccionado de ${this.data.length}`;
      } else if (this.selected.length >= 2) {
        return `${this.selected.length} ítem${
          this.selected.length > 1 ? "s" : ""
        } seleccionados de ${this.data.length}`;
      }
    },

    // Disable a btn de erase in batch
    btnErase() {
      let btnEraseBatch = document.getElementById("btn-erase-batch");

      if (this.selected == "") {
        btnEraseBatch.setAttribute("disabled", "disabled");
      } else if (this.selected != "") {
        btnEraseBatch.removeAttribute("disabled");
      }
    },

    // Eliminación de productos en batch en tabla de existencias.
    async deleteSelected() {
      // Diálogo de confirmación de eliminación en batch
      this.$q
        .dialog({
          title: "Acción Importante: Requiere Confirmación.",
          message:
            "¿Está seguro de eliminar este(os) producto(s) de su inventario? ¡Esta acción es PERMANENTE!",
          ok: {
            push: true,
            label: "Sí! Ya no es(son) útil(es)."
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

            // Borrar en LocalStorage
            let self = this;
            this.selected.filter(item => {
              self.data.splice(self.data.indexOf(item), 1);
              return item;
            });
            // Notificación Popup que confirma la eliminación
            this.$q.notify({
              message:
                "El(Los) ítem(s) seleccionado(s) se ha(n) eliminado exitosamente",
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
            this.selected = [];
          }
        });
    },

    // Eliminación de productos de forma individual en tabla de existencias.
    async deleteval(index) {
      // Diálogo de confirmación de eliminación individual
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
            // Notificación Popup que confirma la eliminación
            this.$q.notify({
              message: "El ítem seleccionado se ha eliminado exitosamente",
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
            this.selected = [];
          }
        });
    },

    // Mostrar u ocultar formulario de creación de producto.
    inputShowAdd: function() {
      if (this.inputShow == false) {
        this.inputShow = true;
      } else if (this.inputShow == true) {
        this.inputShow = false;
      }
    },

    // Traer datos de Firebase a tabla de existencias.
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

    // Limpiar datos (btn) en formulario de creación de producto.
    limpiarItem() {
      this.item = "";
      this.codigo = "";
      this.stock = "";
      this.lugar = "";
      this.tipo = "";
      this.unidad = "";
      this.minimo = "";
    },

    // Guardar datos (btn) en formulario de creación de producto.
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
          this.inputShow = false;

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
