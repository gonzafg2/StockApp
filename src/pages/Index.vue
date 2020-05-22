<template>
  <div class="q-px-xl q-mx-xl">
    <!-- Título de página -->
    <h4 class="flex flex-center">Stock de Productos</h4>

    <!-- Contenedor para btns de formularios de ingreso -->
    <div class="flex flex-center q-pa-md q-mb-lg q-gutter-lg">
      <!-- Btn para desplegar formulario de ingreso de producto. -->
      <q-btn
        class="q-pa-sm q-mx-md btn__lspace"
        unelevated
        rounded
        color="positive"
        label="Ingresar Ítem"
        size="md"
        @click="addItem = true"
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
        class="q-pa-sm q-mx-md btn__lspace"
        unelevated
        rounded
        color="primary"
        label="Entrada de Stock"
        size="md"
        @click="addInput = true"
      >
        <!-- Tooltip para mejor indicación al usuario -->
        <q-tooltip
          anchor="top middle"
          self="bottom middle"
          transition-show="scale"
          transition-hide="scale"
        >
          Toca para desplegar el formulario de entrada de ítem.
        </q-tooltip>
      </q-btn>
      <!-- Btn para desplegar formulario de salida de producto. -->
      <q-btn
        class="q-pa-sm q-mx-md btn__lspace"
        unelevated
        rounded
        color="secondary"
        label="Salida de Stock"
        size="md"
        @click="addOutput = true"
      >
        <!-- Tooltip para mejor indicación al usuario -->
        <q-tooltip
          anchor="top middle"
          self="bottom middle"
          transition-show="scale"
          transition-hide="scale"
        >
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
      <!-- Contenedor de la parte superior de la tabla -->
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

        <!-- Btn para carga masiva de productos -->
        <q-btn
          class="q-ml-lg"
          color="positive"
          icon-right="cloud_upload"
          label=""
          no-caps
          @click="importTable"
        >
          <!-- Tooltip para mejor indicación al usuario -->
          <q-tooltip
            anchor="top middle"
            self="bottom middle"
            transition-show="scale"
            transition-hide="scale"
          >
            Toca para importar datos a esta tabla.
          </q-tooltip>
        </q-btn>

        <!-- Btn de exportar tabla a CSV -->
        <q-btn
          class="q-ml-sm"
          color="primary"
          icon-right="cloud_download"
          label=""
          no-caps
          @click="exportTable"
        >
          <!-- Tooltip para mejor indicación al usuario -->
          <q-tooltip
            anchor="top middle"
            self="bottom middle"
            transition-show="scale"
            transition-hide="scale"
          >
            Toca para exportar a un archivo Excel.
          </q-tooltip>
        </q-btn>

        <!-- Btn para eliminación de un barch de productos (varias filas) -->
        <q-btn
          id="btn-erase-batch"
          class="q-ml-sm"
          color="negative"
          icon-right="delete_forever"
          no-caps
          @click="deleteSelected"
        >
          <!-- Tooltip para mejor indicación al usuario -->
          <q-tooltip
            anchor="top middle"
            self="bottom middle"
            transition-show="scale"
            transition-hide="scale"
          >
            Toca para eliminar los ítems seleccionados.
          </q-tooltip>
        </q-btn>
      </template>

      <!-- TODO: Edición en línea en tabla -->
      <!-- Sección para editar en línea -->
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
          >
            <!-- Tooltip para mejor indicación al usuario -->
            <q-tooltip
              anchor="top middle"
              self="bottom middle"
              transition-show="scale"
              transition-hide="scale"
            >
              Toca para eliminar este ítem.
            </q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- Formulario de ingreso de nuevos productos como ventana modal-->
    <q-dialog
      v-model="addItem"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <!-- Contenedor principal de ventana modal, dentro están todos los elementos -->
      <q-card>
        <!-- Sección superior de ventana modal: Ícono lateral, título y btn de cerrado -->
        <q-card-section class="row items-center q-pb-sm">
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg" />
          </q-avatar>
          <q-space />
          <div class="text-h6">Ingreso de Producto</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <!-- Sección de cuepo de ventana modal: Contiene el formulario -->
        <q-card-section>
          <!-- Formulario  -->
          <q-form @submit="saveFormAddItem" @reset="cleanFormAddItem">
            <!-- Contenedor interno de formulario -->
            <div class="q-gutter-y-md q-px-lg row" style="max-width: 100%">
              <q-input
                label="Código"
                class="col-5"
                type="number"
                v-model.number="codigo"
                :loading="loadingState"
              />

              <div class="col-2"></div>

              <q-input
                label="Stock Mínimo"
                class="col-5"
                v-model.number="minimo"
                type="number"
                :loading="loadingState"
              />

              <q-input
                label="Item"
                class="col-12"
                v-model="item"
                clearable
                autogrow
                :loading="loadingState"
                lazy-rules
                :rules="[val => !!val || 'Este campo es requerido']"
              />

              <q-input
                label="Stock"
                class="col-5"
                v-model.number="stock"
                type="number"
                :loading="loadingState"
                lazy-rules
                :rules="[val => !!val || 'Este campo es requerido']"
              />

              <div class="col-2"></div>

              <q-input
                label="Unidad"
                class="col-5"
                v-model="unidad"
                clearable
                :loading="loadingState"
                lazy-rules
                :rules="[val => !!val || 'Este campo es requerido']"
              />

              <q-input
                label="Tipo"
                class="col-12"
                v-model="tipo"
                clearable
                :loading="loadingState"
                lazy-rules
                :rules="[val => !!val || 'Este campo es requerido']"
              />

              <q-input
                label="Lugar"
                class="col-12"
                v-model="lugar"
                clearable
                :loading="loadingState"
              />
            </div>
            <!-- Contenedor de btns de guardado y limpiado de formulario -->
            <div class="flex flex-center q-pa-md q-gutter-lg">
              <q-btn
                type="submit"
                class="q-pa-sm q-mt-xl"
                unelevated
                rounded
                color="positive"
                label="Guardar"
                size="md"
              />
              <q-btn
                type="reset"
                class="q-pa-sm q-mt-xl"
                outline
                rounded
                color="primary"
                label="Limpiar"
                size="md"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Formulario de ENTRADA de nuevos productos como ventana modal-->
    <q-dialog
      v-model="addInput"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <!-- Contenedor principal de ventana modal, dentro están todos los elementos -->
      <q-card>
        <!-- Sección superior de ventana modal: Ícono lateral, título y btn de cerrado -->
        <q-card-section class="row items-center q-pb-sm">
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg" />
          </q-avatar>
          <q-space />
          <div class="text-h6">Entrada de Producto</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <!-- Sección de cuepo de ventana modal: Contiene el formulario -->
        <q-card-section>
          <!-- Formulario  -->
          <q-form @submit="saveAddInput" @reset="cleanFormAddInput">
            <!-- Contenedor interno de formulario -->
            <div class="q-gutter-y-md q-px-lg row" style="max-width: 100%">
              <q-select
                class="col-9 q-pr-xl"
                v-model="item"
                label="Selección de Ítem"
                use-input
                hide-selected
                fill-input
                input-debounce="0"
                hint="Texto autocompletado"
                @filter="filterFnSelect"
                :options="options"
                lazy-rules
                :rules="[val => !!val || 'Este campo es requerido']"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Sin Resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>

              <q-input
                class="col-3"
                v-model.number="inputCantidad"
                type="number"
                label="Cantidad"
                :loading="loadingState"
                lazy-rules
                :rules="[val => !!val || 'Este campo es requerido']"
              />

              <q-input
                class="col-5 q-my-md"
                v-model.number="inputFactura"
                type="number"
                label="Factura"
                :loading="loadingState"
              />

              <div class="col-2"></div>

              <q-input
                class="col-5 q-my-md"
                v-model.number="inputGuia"
                type="number"
                label="Guía de Despacho"
                :loading="loadingState"
              />

              <q-input
                class="col-12"
                type="textarea"
                v-model="inputObs"
                label="Observación"
                :loading="loadingState"
              />
            </div>

            <!-- Contenedor de btns de guardado y limpiado de formulario -->
            <div class="flex flex-center q-pa-md q-gutter-lg">
              <q-btn
                type="submit"
                class="q-pa-sm q-mt-xl"
                unelevated
                rounded
                color="positive"
                label="Guardar"
                size="md"
              />
              <q-btn
                type="reset"
                class="q-pa-sm q-mt-xl"
                outline
                rounded
                color="primary"
                label="Limpiar"
                size="md"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Formulario de SALIDA de nuevos productos como ventana modal-->
    <q-dialog
      v-model="addOutput"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <!-- Contenedor principal de ventana modal, dentro están todos los elementos -->
      <q-card>
        <!-- Sección superior de ventana modal: Ícono lateral, título y btn de cerrado -->
        <q-card-section class="row items-center q-pb-sm">
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg" />
          </q-avatar>
          <q-space />
          <div class="text-h6">Entrada de Producto</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <!-- Sección de cuepo de ventana modal: Contiene el formulario -->
        <q-card-section>
          <!-- Formulario  -->
          <q-form @submit="guardarOutput" @reset="limpiarOutput">
            <!-- Contenedor interno de formulario -->
            <div class="q-gutter-y-md q-px-lg row" style="max-width: 100%">
              <q-select
                class="col-9 q-pr-xl"
                v-model="item"
                label="Selección de Ítem"
                use-input
                hide-selected
                fill-input
                input-debounce="0"
                hint="Texto autocompletado"
                @filter="filterFnSelect"
                :options="options"
                lazy-rules
                :rules="[val => !!val || 'Este campo es requerido']"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Sin Resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>

              <q-input
                class="col-3"
                v-model.number="outputCantidad"
                type="number"
                label="Cantidad"
                :loading="loadingState"
                lazy-rules
                :rules="[val => !!val || 'Este campo es requerido']"
              />

              <q-input
                class="col-5 q-my-md"
                v-model.number="outputFactura"
                type="number"
                label="Factura"
                :loading="loadingState"
              />

              <div class="col-2"></div>

              <q-input
                class="col-5 q-my-md"
                v-model.number="outputGuia"
                type="number"
                label="Guía de Despacho"
                :loading="loadingState"
              />

              <q-input
                class="col-12"
                type="textarea"
                v-model="outputObs"
                label="Observación"
                :loading="loadingState"
              />
            </div>

            <!-- Contenedor de btns de guardado y limpiado de formulario -->
            <div class="flex flex-center q-pa-md q-gutter-lg">
              <q-btn
                type="submit"
                class="q-pa-sm q-mt-xl"
                unelevated
                rounded
                color="positive"
                label="Guardar"
                size="md"
              />
              <q-btn
                type="reset"
                class="q-pa-sm q-mt-xl"
                outline
                rounded
                color="primary"
                label="Limpiar"
                size="md"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { db } from "../boot/firebase";
import { QSpinnerFacebook } from "quasar";
import { exportFile } from "quasar";
import { bigdata } from "../csvjson";

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

const stringOptions = ["Google", "Facebook", "Twitter", "Apple", "Oracle"];

export default {
  data() {
    return {
      // Mostrar modal Agregar Item
      addItem: false,
      // Mostrar modal Agregar Entrada de Producto
      addInput: false,
      // Mostrar modal Agregar Salida de Producto
      addOutput: false,
      // Animación de Carga en Campo de Formulario
      loadingState: false,
      // Datos para edición in situ en tabla de inventario
      loading1: false,
      percentage1: 0,
      // Animación de carga de datos
      loading: false,
      // Array vacío para selección de datos en tabla
      selected: [],
      // Datos para Select de Ítems en Formulario
      stringOptions,
      options: stringOptions,
      // Columnas Visibles en Tabla de Inventario
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
      // Datos para Formulario de Agregar Produto
      item: "",
      codigo: "",
      lugar: "",
      tipo: "",
      minimo: "",
      stock: "",
      unidad: "",

      // Datos para Formulario de Agregar Entrada
      inputCantidad: "",
      inputFactura: "",
      inputGuia: "",
      inputObs: "",

      // Datos para Columnas de Tabla de Inventario
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
        { name: "stock", label: "Stock", field: "stock", sortable: true },
        { name: "unidad", label: "Unidad", field: "unidad", sortable: true },
        {
          name: "codigo",
          align: "center",
          label: "Código",
          field: "codigo",
          sortable: true
        },
        { name: "id", label: "ID", field: "id", sortable: true },
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

      // Array vacío para función de Filtro en Select de Ítem en Formulario
      filter: "",

      // Número de filas a mostrar en tabla inventario.
      pagination: {
        rowsPerPage: 7
      },

      // Array vacío para traer datos de tabla inventario y renderizarlos.
      data: []
    };
  },
  created() {
    this.listarInventario();
  },
  updated() {
    this.btnErase();
  },

  methods: {
    // Función para filtrar en Select
    filterFnSelect(val, update) {
      if (val === "") {
        update(() => {
          this.options = stringOptions;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.options = stringOptions.filter(
          v => v.toLowerCase().indexOf(needle) > -1
        );
      });
    },

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
        `${dateActual}_Inventario.xlsx`,
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
            color: "positive",
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
            let idArray = this.selected
              .map(el => el.id)
              .forEach(async id => {
                const query = await db
                  .collection("productos")
                  .doc(id)
                  .delete();
              });

            // Borrar en LocalStorage
            let self = this;
            this.selected.filter(item => {
              self.data.splice(self.data.indexOf(item), 1);
              return item;
            });
            // Notificación Popup que confirma la eliminación
            this.$q.notify({
              message:
                "El o los ítem(s) seleccionado(s) se ha(n) eliminado exitosamente",
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
            color: "positive",
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

    // Traer datos de Firebase a tabla de existencias.
    // async listarInOut() {
    async listarInventario() {
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

    // Limpiar datos (btn) en formulario de Creación de Producto.
    cleanFormAddItem() {
      this.item = "";
      this.codigo = "";
      this.stock = "";
      this.lugar = "";
      this.tipo = "";
      this.unidad = "";
      this.minimo = "";
    },
    // Limpiar datos (btn) en formulario de creación de Entrada de Producto.
    cleanFormAddInput() {
      (this.item = ""),
      (this.inputCantidad = ""),
      (this.inputFactura = ""),
      (this.inputGuia = ""),
      (this.inputObs = "");
    },

    // Carga Masiva
    async importTable() {
      this.$q
        .dialog({
          title: "Acción Importante: Requiere Confirmación.",
          message:
            "¿Está seguro de importar estos datos dentro de su inventario?",
          ok: {
            push: true,
            color: "positive",
            label: "¡Sí!."
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
            const importBigData = bigdata.forEach(async set => {
              const query = await db.collection("productos").add(set);
            });
            this.$q.notify({
              message:
                "La importación de productos se ha realizado exitosamente",
              color: "positive",
              textColor: "white",
              type: "positive",
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

    // Guardar datos (btn) en formulario de creación de producto.
    saveFormAddItem() {
      this.$q
        .dialog({
          title: "Acción Importante: Requiere Confirmación.",
          message:
            "¿Está seguro de guardar este producto dentro de su inventario?",
          ok: {
            push: true,
            color: "positive",
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
          try {
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
          } catch (error) {
            this.$q.notify({
              message: `Ha ocurrido un problema. El error es: ${error}`,
              color: "red",
              textColor: "white",
              icon: "clear"
            });
          } finally {
            this.addItem = false;

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
          }
        });
    },

    // Guardar datos (btn) en formulario de creación de producto.
    saveAddInput() {
      this.$q
        .dialog({
          title: "Acción Importante: Requiere Confirmación.",
          message: "¿Está seguro de guardar esta entrada de producto",
          ok: {
            push: true,
            color: "positive",
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
          let query = await db.collection("entradas").add({
            item: this.item,
            codigo: this.codigo,
            stock: this.stock,
            lugar: this.lugar,
            tipo: this.tipo,
            unidad: this.unidad,
            minimo: this.minimo
          });
          // await this.data.push({
          //   id: query.id,
          //   item: this.item,
          //   codigo: this.codigo,
          //   stock: this.stock,
          //   lugar: this.lugar,
          //   tipo: this.tipo,
          //   unidad: this.unidad,
          //   minimo: this.minimo
          // });
          this.addItem = false;

          this.item = "";
          this.codigo = "";
          this.stock = "";
          this.lugar = "";
          this.tipo = "";
          this.unidad = "";
          this.minimo = "";

          this.$q.notify({
            message: "La entrada se ha guardado exitosamente",
            color: "positive",
            textColor: "white",
            type: "positive",
            position: "top"
          });
        });
    }

    // Mostrar u ocultar formulario de creación de producto.
    // inputShowAdd: function() {
    //   if (this.inputShow == false) {
    //     this.inputShow = true;
    //   } else if (this.inputShow == true) {
    //     this.inputShow = false;
    //   }
    // },
  }
};
</script>
