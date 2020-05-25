<template>
  <div class="q-px-xl q-mx-xl">
    <!-- Título de página -->
    <h5 class="flex flex-center q-pb-none q-mb-lg">Inventario de Productos</h5>

    <!-- Contenedor para btns de formularios de ingreso -->
    <div class="flex flex-center q-px-md q-mb-lg q-gutter-lg">
      <!-- Btn para desplegar formulario de ingreso de producto. -->
      <q-btn
        class="q-pa-xs q-mx-md btn__lspace"
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
        class="q-pa-xs q-mx-md btn__lspace"
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
        class="q-pa-xs q-mx-md btn__lspace"
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
      class="fit"
      row-key="item"
      rows-per-page-label="Ítems por página"
      no-data-label="Sin información disponible"
      no-results-label="No se encontraron resultados..."
      :rows-per-page-options="[10]"
      selection="multiple"
      binary-state-sort
    >
      <!-- Contenedor de la parte superior de la tabla -->
      <template v-slot:top>
        <!-- Ícono lateral izquierdo de la tabla de productos -->
        <q-icon
          style="font-size: 2.5rem"
          color="positive"
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
          class="q-pr-md"
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

      <!-- Btnes para Acciones (Update & Delete) sobre un Item (fila) individual -->
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <!-- Btn para Actualizar Item -->
          <q-btn
            color="primary"
            icon-right="edit"
            no-caps
            flat
            dense
            @click="updateval(props.row)"
          >
            <!-- Tooltip para mejor indicación al usuario -->
            <q-tooltip
              anchor="top middle"
              self="bottom middle"
              transition-show="scale"
              transition-hide="scale"
            >
              Toca para actualizar este ítem.
            </q-tooltip>
          </q-btn>

          <!-- Btn para Eliminar Item -->
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

      <!-- Animación para carga procesos en la tabla de inventario -->
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
    </q-table>

    <h5 class="flex flex-center q-pb-none q-mb-lg">
      Listado de Movimientos de Stock
    </h5>

    <!-- Tabla de Movimientos de Productos -->
    <q-table
      :data="inout"
      :columns="columnsInOut"
      :loading="loading"
      :filter="filterInOut"
      :pagination.sync="pagination"
      :pagination-label="getPaginationLabel"
      :visible-columns="visibleColumnsInOut"
      color="primary"
      class="fit q-mt-lg q-mb-xl"
      row-key="id"
      rows-per-page-label="Ítems por página"
      no-data-label="Sin información disponible"
      no-results-label="No se encontraron resultados..."
      :rows-per-page-options="[10]"
      binary-state-sort
    >
      <!-- Contenedor de la parte superior de la tabla -->
      <template v-slot:top>
        <!-- Ícono lateral izquierdo de la tabla de productos -->
        <q-icon style="font-size: 2.5rem" color="primary" name="assignment" />

        <!-- Contenedor de Toggle para mostrar u ocultar columnas -->
        <div v-if="$q.screen.gt.xs" class="col flex flex-center">
          <!-- Toggle de Columna de Item -->
          <q-toggle
            class="q-px-sm"
            v-model="visibleColumnsInOut"
            val="item"
            label="Item"
          />

          <!-- Toggle de Columna de Unidad -->
          <q-toggle
            class="q-px-sm"
            v-model="visibleColumnsInOut"
            val="unidad"
            label="Unidad"
          />

          <!-- Toggle de Columna de Entregado a -->
          <q-toggle
            class="q-px-sm"
            v-model="visibleColumnsInOut"
            val="entregado_a"
            label="Entregado"
          />
          <!-- Toggle de Columna de Observaciones -->
          <q-toggle
            class="q-px-sm"
            v-model="visibleColumnsInOut"
            val="observacion"
            label="Obs."
          />
          <!-- Toggle de Columna de Hoja de Registro -->
          <q-toggle
            class="q-px-sm"
            v-model="visibleColumnsInOut"
            val="hoja_registro"
            label="Nº Hoja"
          />
        </div>

        <!-- ComboBox (Select) de columnas en versión móvil o en anchos pequeños de pantalla -->
        <q-select
          v-else
          v-model="visibleColumnsInOut"
          multiple
          borderless
          dense
          options-dense
          :display-value="$q.lang.table.columns"
          emit-value
          map-options
          :options="columnsInOut"
          option-value="name"
          style="min-width: 150px"
        />

        <!-- Campo de búsqueda -->
        <q-input
          dense
          debounce="300"
          class="q-pr-md"
          color="primary"
          v-model="filterInOut"
          placeholder="Buscar..."
        >
          <!-- Icono de campo de búsqueda -->
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <!-- Btn de exportar tabla a CSV -->
        <q-btn
          class="q-ml-sm"
          color="primary"
          icon-right="cloud_download"
          label=""
          no-caps
          @click="exportTableInOut"
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
      </template>

      <!-- Animación para carga procesos en la tabla de inventario -->
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
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
              <!-- Código -->
              <q-input
                label="Código"
                class="col-5"
                type="number"
                min="0"
                v-model.number="codigo"
                :loading="loadingState"
                hint="ID del producto"
              />

              <div class="col-2"></div>

              <!-- Stock Mínimo -->
              <q-input
                label="Stock Mínimo"
                class="col-5"
                v-model.number="minimo"
                type="number"
                min="0"
                :loading="loadingState"
                hint="Cantidad Mínima"
              />

              <!-- Item -->
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

              <!-- Stock (Cantidad) -->
              <q-input
                label="Stock"
                class="col-5"
                v-model.number="stock"
                type="number"
                min="0"
                :loading="loadingState"
                lazy-rules
                :rules="[val => !!val || 'Este campo es requerido']"
                hint="Cantidad Actual"
              />

              <div class="col-2"></div>

              <!-- Unidad -->
              <q-input
                label="Unidad"
                class="col-5"
                v-model="unidad"
                clearable
                :loading="loadingState"
                lazy-rules
                :rules="[val => !!val || 'Este campo es requerido']"
              />

              <!-- Tipo -->
              <q-input
                label="Tipo"
                class="col-12"
                v-model="tipo"
                clearable
                :loading="loadingState"
                lazy-rules
                :rules="[val => !!val || 'Este campo es requerido']"
              />

              <!-- Lugar -->
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
              <!-- Submit -->
              <q-btn
                type="submit"
                class="q-pa-sm q-mt-xl"
                unelevated
                rounded
                color="positive"
                label="Guardar"
                size="md"
              />
              <!-- Reset -->
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

    <!-- Formulario de Actualización de Producto Existente como ventana modal-->
    <q-dialog
      v-model="updateItem"
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
          <div class="text-h6">Actualización de Producto</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <!-- Sección de cuepo de ventana modal: Contiene el formulario -->
        <q-card-section>
          <!-- Formulario  -->
          <q-form @submit="updateFormItem">
            <!-- Contenedor interno de formulario -->
            <div class="q-gutter-y-md q-px-lg row" style="max-width: 100%">
              <q-input
                label="Código"
                class="col-5"
                type="number"
                min="0"
                v-model.number="codigoUpdate"
                hint="Sólo lectura"
                readonly
                disable
              />

              <div class="col-2"></div>

              <q-input
                label="Stock Mínimo"
                class="col-5"
                v-model.number="minimoUpdate"
                type="number"
                min="0"
                :loading="loadingState"
                hint="Cantidad Mínima"
              />

              <q-input
                label="Item"
                class="col-12"
                v-model="itemUpdate"
                autogrow
                hint="Sólo lectura"
                readonly
                disable
              />

              <q-input
                label="Stock"
                class="col-5"
                v-model.number="stockUpdate"
                type="number"
                min="0"
                hint="Sólo lectura"
                readonly
                disable
              />

              <div class="col-2"></div>

              <q-input
                label="Unidad"
                class="col-5"
                v-model="unidadUpdate"
                clearable
                :loading="loadingState"
                lazy-rules
                :rules="[val => !!val || 'Este campo es requerido']"
              />

              <q-input
                label="Tipo"
                class="col-12"
                v-model="tipoUpdate"
                clearable
                :loading="loadingState"
                lazy-rules
                :rules="[val => !!val || 'Este campo es requerido']"
              />

              <q-input
                label="Lugar"
                class="col-12"
                v-model="lugarUpdate"
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
                color="primary"
                label="Actualizar"
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
                class="col-12"
                v-model="item"
                label="Selección de Ítem"
                use-input
                hide-selected
                fill-input
                input-debounce="0"
                hint="Escribir al menos 2 caracteres..."
                @filter="filterFn"
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
                min="1"
                label="Cantidad"
                :loading="loadingState"
                lazy-rules
                :rules="[val => !!val || 'Este campo es requerido']"
                hint="Mínimo 1"
              />

              <div class="col-1"></div>

              <q-input
                class="col-3"
                v-model.number="inputFactura"
                type="number"
                min="1"
                label="Factura"
                :loading="loadingState"
                hint="Nº de Factura"
              />

              <div class="col-1"></div>

              <q-input
                class="col-4"
                v-model.number="inputGuia"
                type="number"
                min="1"
                label="Guía de Despacho"
                :loading="loadingState"
                hint="Nº de Guía"
              />

              <q-input
                class="col-12 q-mt-sm"
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
          <div class="text-h6">Salida de Producto</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <!-- Sección de cuepo de ventana modal: Contiene el formulario -->
        <q-card-section>
          <!-- Formulario  -->
          <q-form @submit="saveAddOutput" @reset="cleanFormAddOutput">
            <!-- Contenedor interno de formulario -->
            <div class="q-gutter-y-md q-px-lg row" style="max-width: 100%">
              <q-select
                class="col-12"
                v-model="item"
                label="Selección de Ítem"
                use-input
                hide-selected
                fill-input
                input-debounce="0"
                hint="Escribir al menos 2 caracteres..."
                @filter="filterFn"
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
                min="1"
                label="Cantidad"
                :loading="loadingState"
                lazy-rules
                :rules="[val => !!val || 'Este campo es requerido']"
                hint="Mínimo 1"
              />

              <div class="col-1"></div>

              <q-input
                class="col-3"
                v-model.number="outputFactura"
                type="number"
                min="1"
                label="Factura"
                :loading="loadingState"
                hint="Nº de Factura"
              />

              <div class="col-1"></div>

              <q-input
                class="col-4"
                v-model.number="outputGuia"
                type="number"
                min="1"
                label="Guía de Despacho"
                :loading="loadingState"
                hint="Nº de Guía"
              />

              <q-input
                class="col-7"
                v-model="outputEntregado"
                label="Entregado a:"
                :loading="loadingState"
                hint="¿Quién recepciona el producto?"
              />

              <div class="col-1"></div>

              <q-input
                class="col-4"
                v-model.number="outputHojaRegistro"
                type="number"
                min="1"
                label="Registro"
                :loading="loadingState"
                hint="Número de hoja"
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
import { db, firebase } from "../boot/firebase";
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

let stringOptions = [];

const timestamp = firebase.firestore.FieldValue.serverTimestamp();

const diaNombres = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
const diaCeros = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09"];
const MesLargo = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre"
];

export default {
  data() {
    return {
      // Mostrar modal Agregar Item
      addItem: false,
      // Mostrar modal Actualizar Item
      updateItem: false,
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
      // Columnas Visibles en Tabla de Movimientos
      visibleColumnsInOut: [
        "item",
        "codigo",
        "factura",
        // "unidad",
        "guia",
        // "observacion",
        // "entregado_a",
        // "hoja_registro",
        "fecha",
        "mes",
        "entrada",
        "salida"
      ],
      // Datos para Formulario de Agregar Produto
      id: "",
      item: "",
      itemLoad: "",
      codigo: "",
      lugar: "",
      lugarLoad: "",
      tipo: "",
      tipoLoad: "",
      minimo: "",
      stock: "",
      unidad: "",
      unidadLoad: "",

      // Datos para Formulario de Actualizar Producto
      idUpdate: "",
      itemUpdate: "",
      stockUpdate: "",
      codigoUpdate: "",
      minimoUpdate: "",
      lugarUpdate: "",
      lugarUpdateLoad: "",
      tipoUpdate: "",
      tipoUpdateLoad: "",
      unidadUpdate: "",
      unidadUpdateLoad: "",

      // Datos para Tabla Movimientos
      id_inout: "",

      // Datos para Formulario de Agregar Entrada
      inputItem: "",
      inputCantidad: "",
      inputFactura: "",
      inputGuia: "",
      inputObs: "",

      // Datos para Formulario de Agregar Salida
      outputItem: "",
      outputCantidad: "",
      outputEntregado: "",
      outputHojaRegistro: "",
      outputFactura: "",
      outputGuia: "",
      outputObs: "",

      // Datos para Update
      idRowTable: null,

      // Datos para Columnas de Tabla de Movimientos
      columnsInOut: [
        { name: "mes", label: "Mes", field: "mes", sortable: true },
        {
          name: "fecha",
          required: true,
          label: "Fecha",
          align: "center",
          field: row => row.fecha,
          format: val => `${val}`,
          sortable: true
        },
        { name: "id_inout", label: "ID", field: "id_inout", sortable: true },
        {
          name: "codigo",
          label: "Código",
          field: "codigo",
          sortable: true,
          align: "center"
        },
        {
          name: "item",
          label: "Item",
          field: "item",
          sortable: true,
          align: "center"
        },
        {
          name: "unidad",
          label: "Unidad",
          field: "unidad",
          sortable: true,
          align: "center"
        },
        {
          name: "entrada",
          label: "Entrada",
          field: "entrada",
          sortable: true,
          align: "center"
        },
        {
          name: "salida",
          label: "Salida",
          field: "salida",
          sortable: true,
          align: "center"
        },
        {
          name: "factura",
          label: "Factura",
          field: "factura",
          sortable: true,
          align: "center"
        },
        {
          name: "guia",
          label: "Guía",
          field: "guia",
          sortable: true,
          align: "center"
        },
        {
          name: "entregado_a",
          label: "Entregado a:",
          field: "entregado_a",
          sortable: true,
          align: "center"
        },
        {
          name: "observacion",
          label: "Observación",
          field: "observacion",
          align: "center"
        },
        {
          name: "hoja_registro",
          label: "Hoja de Registro",
          field: "hoja_registro",
          sortable: true,
          align: "center"
        }
      ],

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
        { name: "action", label: "Acciones", field: "action", align: "center" }
      ],

      // Array vacío para Filtro en Tabla de Inventario
      filter: "",

      // Array vacío para Filtro en Tabla de Movimientos
      filterInOut: "",

      // Número de filas a mostrar en tabla inventario.
      pagination: {
        rowsPerPage: 10
      },

      // Array vacío para traer datos de Tabla Inventario y renderizarlos.
      data: [],

      // Array vacío para traer datos de Tabla Movimientos de Stock
      inout: []
    };
  },
  created() {
    this.listarInventario();
    this.listarInOut();
  },
  updated() {
    this.btnErase();
  },

  methods: {
    // Traer datos de Firebase a arreglo "data" en Tabla de Productos.
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

        // Almaceno BD en constante query.
        const query = await db.collection("productos").get();

        // query es un objeto de más objetos, por lo que hay que transformarlo a un arreglo de objetos.
        await query.forEach(elemento => {
          // elemento es cada objeto dentro del objeto query recibido

          // Defino variables para normalizar los datos
          let id = elemento.id;
          let item = elemento.data().item;
          let stock = elemento.data().stock;
          let codigo = elemento.data().codigo;
          let unidad = elemento.data().unidad;
          let lugar = elemento.data().lugar;
          let tipo = elemento.data().tipo;
          let minimo = elemento.data().minimo;

          // Si unidad está vacío, poner un guíon (-).
          if (unidad == "") {
            unidad = "-";
          }
          // Si lugar está vacío, poner un guíon (-).
          if (lugar == "") {
            lugar = "-";
          }

          // Defino el objeto producto con los valores a exportar.
          let producto = {
            id: id,
            item: item,
            stock: stock,
            codigo: codigo,
            unidad: unidad,
            lugar: lugar,
            tipo: tipo,
            minimo: minimo
          };
          // Exporto el objeto producto al arreglo creado data.
          // Se recibe desde Firestore y se almacena en LocalStorage como un arreglo
          // de objetos.
          this.data.push(producto);
        });
      } catch (error) {
        // Mostrar error en consola.
        console.log(error);
        // Mostrar error como notificación.
      } finally {
        this.$q.loading.hide();

        await this.data.forEach(e => {
          let das = e.item;
          this.stringOptions.push(das);
        });
      }
    },

    // Traer datos de Firebase a Tabla de Movimientos.
    async listarInOut() {
      try {
        const spinner =
          typeof QSpinnerFacebook !== "undefined"
            ? QSpinnerFacebook // Non-UMD, imported above
            : Quasar.components.QSpinnerFacebook; // eslint-disable-line

        this.$q.loading.show({
          spinner,
          spinnerColor: "indigo",
          spinnerSize: 140,
          backgroundColor: "indigo",
          message: "Por favor espere. Se están cargando sus datos...",
          messageColor: "white"
        });

        const queryIn = await db.collection("entradas").get();
        const queryOut = await db.collection("salidas").get();
        const getCodigo = await db.collection("productos").get();
        // console.log(queryIn);

        let productoTable = [];

        await getCodigo.forEach(elemento => {
          let producto = {
            item: elemento.data().item,
            codigo: elemento.data().codigo,
            unidad: elemento.data().unidad
          };
          productoTable.push(producto);
        });

        queryIn.forEach(ids => {
          // Recibir de Firestore Fecha en Segundos y Convertir a Milisegundos
          let dateMiliSeconds = ids.data().fecha.seconds * 1000;

          // Tomar como argumento dato anterior para Clase Date
          let dateJSON = new Date(dateMiliSeconds);

          // Día: Nombre y Número
          let diaNom = diaNombres[dateJSON.getDay()];
          let diaNum = dateJSON.getDate();
          let diaConCeros = diaNum;
          for (let i = 1; i < 10; i++) {
            if (diaNum === i) {
              diaConCeros = `0${i}`;
            }
          }

          // Mes: Nombre y Número
          let mesLargo = MesLargo[dateJSON.getMonth()];
          let mesN = dateJSON.getMonth() + 1;

          // Año: Largo y Corto
          let año = dateJSON.getFullYear();

          // Fecha a mostrar en Tabla Movimientos
          let fechaReal = `${diaNom}, ${diaConCeros} de ${mesLargo} del  ${año}`;

          // Arreglo con objeto que tenga el mismo Item
          let ArrFiltro = productoTable.filter(
            fil => fil.item == ids.data().item
          );
          console.log(ids.data().item);

          // Obtener Código de Item Seleccionado
          let codigoItem = ArrFiltro[0].codigo;

          // Obtener Unidad de Item Seleccionado
          let unidadItem = ArrFiltro[0].unidad;

          let factura = ids.data().factura;
          let guia = ids.data().guia;
          let observaciones = ids.data().observacion;

          if (factura == "") {
            factura = "-";
          }
          if (guia == "") {
            guia = "-";
          }
          if (observaciones == "") {
            observaciones = "-";
          }

          let entradas = {
            id_inout: ids.id,
            mes: mesLargo,
            fecha: fechaReal,
            codigo: codigoItem,
            item: ids.data().item,
            unidad: unidadItem,
            entrada: ids.data().cantidad,
            factura: factura,
            guia: guia,
            observacion: observaciones,
            salida: "-",
            entregado_a: "-",
            hoja_registro: "-"
          };
          this.inout.push(entradas);
        });

        queryOut.forEach(ids => {
          // Recibir de Firestore Fecha en Segundos y Convertir a Milisegundos
          let dateMiliSeconds = ids.data().fecha.seconds * 1000;

          // Tomar como argumento dato anterior para Clase Date
          let dateJSON = new Date(dateMiliSeconds);

          // Día: Nombre y Número
          let diaNom = diaNombres[dateJSON.getDay()];
          let diaNum = dateJSON.getDate();
          let diaConCeros = diaNum;
          for (let i = 1; i < 10; i++) {
            if (diaNum === i) {
              diaConCeros = `0${i}`;
            }
          }

          // Mes: Nombre y Número
          let mesLargo = MesLargo[dateJSON.getMonth()];
          let mesN = dateJSON.getMonth() + 1;

          // Año: Largo y Corto
          let año = dateJSON.getFullYear();

          // Fecha a mostrar en Tabla Movimientos
          let fechaReal = `${diaNom}, ${diaConCeros} de ${mesLargo} del  ${año}`;

          // Arreglo con objeto que tenga el mismo Item
          let filArray = productoTable.filter(
            fil => fil.item == ids.data().item
          );

          // Obtener Código de Item Seleccionado
          let codigoItem = filArray[0].codigo;

          // Obtener Unidad de Item Seleccionado
          let unidadItem = filArray[0].unidad;

          let factura = ids.data().factura;
          let guia = ids.data().guia;
          let entregado = ids.data().entregado_a;
          let observaciones = ids.data().observacion;
          let hoja_registro = ids.data().hoja_registro;

          if (factura == "") {
            factura = "-";
          }
          if (guia == "") {
            guia = "-";
          }
          if (entregado == "") {
            entregado = "Sin información";
          }
          if (observaciones == "") {
            observaciones = "-";
          }
          if (hoja_registro == "") {
            hoja_registro = "-";
          }

          let salidas = {
            id_inout: ids.id,
            mes: mesLargo,
            fecha: fechaReal,
            unidad: unidadItem,
            codigo: codigoItem,
            item: ids.data().item,
            salida: ids.data().cantidad,
            factura: factura,
            guia: guia,
            observacion: observaciones,
            entregado_a: entregado,
            hoja_registro: hoja_registro,
            entrada: "-"
          };
          this.inout.push(salidas);
        });

        // console.log(this.inout);
      } catch (error) {
        console.log(error);
      } finally {
        this.$q.loading.hide();
      }
    },

    // Actualización de Producto: Formulario en modal
    async updateval(index) {
      try {
        // Abrir Modal de Update de Ítem
        this.updateItem = true;

        // Obtener el objeto de la fila completa de tabla y guardarlo en idF.
        this.idUpdate = index.id;

        // Obtener id de la fila para este item específico.
        this.idRowTable = this.data.indexOf(index);

        // Mostrar los datos obtenidos en formulario.
        (this.itemUpdate = index.item),
          (this.stockUpdate = index.stock),
          (this.codigoUpdate = index.codigo),
          (this.unidadUpdate = index.unidad),
          (this.lugarUpdate = index.lugar),
          (this.tipoUpdate = index.tipo),
          (this.minimoUpdate = index.minimo);
      } catch (error) {
        this.$q.notify({
          message: `Ha ocurrido un problema. El error es: ${error}`,
          color: "red",
          textColor: "white",
          icon: "clear"
        });
      } finally {
      }
    },

    // Actualización de Porducto: Botón de edición.
    updateFormItem() {
      this.$q
        .dialog({
          title: "Acción Importante: Requiere Confirmación.",
          message:
            "¿Está seguro de actualizar este producto? Los cambios no pueden revertirse.",
          ok: {
            push: true,
            color: "positive",
            label: "Sí, actualizar."
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
            // Normalizo para Capitalizar dato.
            let lugarUpdateLoadPre =
              this.lugarUpdate.charAt(0).toUpperCase() +
              this.lugarUpdate.slice(1);
            this.lugarUpdateLoad = lugarUpdateLoadPre.replace(/\s+/g, " ");
            let tipoUpdateLoadPre =
              this.tipoUpdate.charAt(0).toUpperCase() +
              this.tipoUpdate.slice(1);
            this.tipoUpdateLoad = tipoUpdateLoadPre.replace(/\s+/g, " ");
            let unidadUpdateLoadPre =
              this.unidadUpdate.charAt(0).toUpperCase() +
              this.unidadUpdate.slice(1);
            this.unidadUpdateLoad = unidadUpdateLoadPre.replace(/\s+/g, " ");

            // Actualizo "lugar", "tipo", "unidad" y "minimo" en Firestore.
            let query = await db
              .collection("productos")
              .doc(this.idUpdate)
              .update({
                lugar: this.lugarUpdateLoad,
                tipo: this.tipoUpdateLoad,
                unidad: this.unidadUpdateLoad,
                minimo: this.minimoUpdate
              });
            // Actualizar en Tabla Inventario en LocalStorage.
            this.data[this.idRowTable].lugar = this.lugarUpdateLoad;
            this.data[this.idRowTable].tipo = this.tipoUpdateLoad;
            this.data[this.idRowTable].unidad = this.unidadUpdateLoad;
            this.data[this.idRowTable].minimo = this.minimoUpdate;
          } catch (error) {
            this.$q.notify({
              message: `Ha ocurrido un problema. El error es: ${error}`,
              color: "red",
              textColor: "white",
              icon: "clear"
            });
          } finally {
            // Cierro ventana modal de Actualizar Producto.
            this.updateItem = false;

            // Vuelvo a nulo id de la fila donde está el producto a actualizar.
            this.idRowTable = null;

            this.idUpdate = "";
            this.itemUpdate = "";
            this.codigoUpdate = "";
            this.stockUpdate = "";
            this.lugarUpdate = "";
            this.tipoUpdate = "";
            this.tipoUpdateLoad = "";
            this.unidadUpdate = "";
            this.unidadUpdateLoad = "";
            this.minimoUpdate = "";

            this.$q.notify({
              message: "El producto se ha actualizado exitosamente",
              color: "positive",
              textColor: "white",
              type: "positive",
              position: "top"
            });
          }
        });
    },

    // Guardar datos (btn) en formulario de CREACION de Producto.
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
            // Normalizo input de Item para eliminar espacios y dejar en mayúscula.
            this.itemLoad = this.item
              .toUpperCase()
              .trim()
              .replace(/\s+/g, " ");

            // Si stock mínimo está vacío, dejarlo como cero.
            if (this.minimo === "") {
              this.minimo = 0;
            }

            // Normalizo para Capitalizar dato.
            let lugarLoadPre =
              this.lugar.charAt(0).toUpperCase() + this.lugar.slice(1);
            this.lugarLoad = lugarLoadPre.replace(/\s+/g, " ");
            let tipoLoadPre =
              this.tipo.charAt(0).toUpperCase() + this.tipo.slice(1);
            this.tipoLoad = tipoLoadPre.replace(/\s+/g, " ");
            let unidadLoadPre =
              this.unidad.charAt(0).toUpperCase() + this.unidad.slice(1);
            this.unidadLoad = unidadLoadPre.replace(/\s+/g, " ");

            let query = await db.collection("productos").add({
              item: this.itemLoad,
              codigo: this.codigo,
              stock: this.stock,
              lugar: this.lugarLoad,
              tipo: this.tipoLoad,
              unidad: this.unidadLoad,
              minimo: this.minimo
            });
            await this.data.push({
              id: query.id,
              item: this.itemLoad,
              codigo: this.codigo,
              stock: this.stock,
              lugar: this.lugarLoad,
              tipo: this.tipoLoad,
              unidad: this.unidadLoad,
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
            this.itemLoad = "";
            this.codigo = "";
            this.stock = "";
            this.lugar = "";
            this.lugarLoad = "";
            this.tipo = "";
            this.tipoLoad = "";
            this.unidad = "";
            this.unidadLoad = "";
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

    // Guardar datos (btn) en formulario de ENTRADA de Producto.
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
          try {
            // Añade los datos del formulario Entrada de Producto a Firebase.
            let query = await db.collection("entradas").add({
              cantidad: this.inputCantidad,
              factura: this.inputFactura,
              fecha: timestamp,
              guia: this.inputGuia,
              item: this.item,
              observaciones: this.inputObs
            });

            let getStock = await db.collection("productos").get();

            let productoTable = [];

            await getStock.forEach(elemento => {
              let producto = {
                id: elemento.id,
                item: elemento.data().item,
                stock: elemento.data().stock,
                codigo: elemento.data().codigo,
                unidad: elemento.data().unidad
              };
              productoTable.push(producto);
            });

            // Buscar Arreglo con objeto que tenga el mismo nombre de Item
            let filArray = productoTable.filter(fil => fil.item == this.item);

            // Obtener ID de Item Seleccionado
            let idSelInput = filArray[0].id;

            // Obtener Stock de Item Seleccionado
            let stockItem = filArray[0].stock;

            let stockSuma = stockItem + this.inputCantidad;

            // Actualizar campo de stock con dato ingresado en formulario
            let update = db
              .collection("productos")
              .doc(idSelInput)
              .update({
                stock: stockSuma
              });

            // Actualizar Suma en Tabla Inventario

            // Actualizar en LocalStorage Tabla Movimientos
            // let dateMiliSeconds = ids.data().fecha.seconds * 1000

            // Tomar como argumento dato anterior para Clase Date
            // let dateJSON = new Date(dateMiliSeconds);
            let dateJSON = new Date();

            // Día: Nombre y Número
            let diaNom = diaNombres[dateJSON.getDay()];
            let diaNum = dateJSON.getDate();
            let diaConCeros = diaNum;
            for (let i = 1; i < 10; i++) {
              if (diaNum === i) {
                diaConCeros = `0${i}`;
              }
            }

            // Mes: Nombre y Número
            let mesLargo = MesLargo[dateJSON.getMonth()];
            let mesN = dateJSON.getMonth() + 1;

            // Año: Largo y Corto
            let año = dateJSON.getFullYear();

            // Fecha a mostrar en Tabla Movimientos
            let fechaReal = `${diaNom}, ${diaConCeros} de ${mesLargo} del  ${año}`;

            // Arreglo con objeto que tenga el mismo Item
            // let filArray = productoTable.filter(fil => fil.item == ids.data().item);

            // Obtener Código de Item Seleccionado
            let codigoItem = filArray[0].codigo;

            // Obtener Unidad de Item Seleccionado
            let unidadItem = filArray[0].unidad;

            let factura = this.inputFactura;
            let guia = this.inputGuia;
            let observaciones = this.inputObs;

            if (factura == "") {
              factura = "-";
            }
            if (guia == "") {
              guia = "-";
            }
            if (observaciones == "") {
              observaciones = "-";
            }
            await this.inout.push({
              mes: mesLargo,
              fecha: fechaReal,
              codigo: codigoItem,
              item: this.item,
              unidad: unidadItem,
              entrada: this.inputCantidad,
              factura: factura,
              guia: guia,
              observacion: observaciones,
              salida: "-",
              entregado_a: "-",
              hoja_registro: "-"
            });
          } catch (error) {
            this.$q.notify({
              message: `Ha ocurrido un problema. El error es: ${error}`,
              color: "red",
              textColor: "white",
              icon: "clear"
            });
          } finally {
            this.addInput = false;

            this.item = "";
            this.inputCantidad = "";
            this.inputFactura = "";
            this.inputGuia = "";
            this.inputObs = "";

            this.$q.notify({
              message: "La entrada se ha guardado exitosamente",
              color: "positive",
              textColor: "white",
              type: "positive",
              position: "top"
            });
          }
        });
    },

    // Función para filtrar en Select
    filterFn(val, update, abort) {
      if (val.length < 2) {
        abort();
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.options = stringOptions.filter(
          v => v.toLowerCase().indexOf(needle) > -1
        );
      });
    },

    // Script para exportar Tabla Movimientos de Productos a archvio CSV
    exportTableInOut() {
      // naive encoding to csv format
      const content = [this.columnsInOut.map(col => wrapCsvValue(col.label))]
        .concat(
          this.inout.map(row =>
            this.columnsInOut
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
        `${dateActual}_Movimientos.xlsx`,
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

    // Desactivar btn de eliminar en batch cuando no hay selección.
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

    // Limpiar datos (btn) en formulario de ENTRADA de Producto.
    cleanFormAddInput() {
      (this.item = ""),
        (this.inputCantidad = ""),
        (this.inputFactura = ""),
        (this.inputGuia = ""),
        (this.inputObs = "");
    },

    // Limpiar datos (btn) en formulario de SALIDA de Producto.
    cleanFormAddOutput() {
      (this.item = ""),
        (this.outputCantidad = ""),
        (this.outputFactura = ""),
        (this.outputGuia = ""),
        (this.outputEntregado = "");
      this.outputHojaRegistro = "";
      this.outputObs = "";
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
            // TODO: Corregir animación de espera para carga masiva
            this.loading = true;
            const importBigData = bigdata.forEach(async set => {
              const query = await db.collection("productos").add(set);

              await this.data.push({
                id: set.id,
                item: set.item,
                codigo: set.codigo,
                stock: set.stock,
                lugar: set.lugar,
                tipo: set.tipo,
                unidad: set.unidad,
                minimo: set.minimo
              });
            });
          } catch (error) {
            this.$q.notify({
              message: `Ha ocurrido un problema. El error es: ${error}`,
              color: "red",
              textColor: "white",
              icon: "clear"
            });
          } finally {
            // this.$q.loading.hide();
            this.loading = false;

            this.$q.notify({
              message:
                "La importación de productos se ha realizado exitosamente",
              color: "positive",
              textColor: "white",
              type: "positive",
              position: "top"
            });
          }
        });
    },

    // Guardar datos (btn) en formulario de SALIDA de Producto.
    saveAddOutput() {
      this.$q
        .dialog({
          title: "Acción Importante: Requiere Confirmación.",
          message: "¿Está seguro de guardar esta salida de producto",
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
            let query = await db.collection("salidas").add({
              cantidad: this.outputCantidad,
              factura: this.outputFactura,
              fecha: timestamp,
              guia: this.outputGuia,
              entregado_a: this.outputEntregado,
              hoja_registro: this.outputHojaRegistro,
              item: this.item,
              observacion: this.outputObs
            });

            let getStock = await db.collection("productos").get();

            let productoTable = [];

            await getStock.forEach(elemento => {
              let producto = {
                id: elemento.id,
                item: elemento.data().item,
                stock: elemento.data().stock
              };
              productoTable.push(producto);
            });

            // Buscar Arreglo con objeto que tenga el mismo nombre de Item
            let filArray = productoTable.filter(fil => fil.item == this.item);

            // Obtener ID de Item Seleccionado
            let idSelOutput = filArray[0].id;

            // Obtener Stock de Item Seleccionado
            let stockItem = filArray[0].stock;

            let stockSuma = stockItem - this.outputCantidad;

            // Actualizar campo de stock con dato ingresado en formulario
            let update = db
              .collection("productos")
              .doc(idSelOutput)
              .update({
                stock: stockSuma
              });
          } catch (error) {
            this.$q.notify({
              message: `Ha ocurrido un problema. El error es: ${error}`,
              color: "red",
              textColor: "white",
              icon: "clear"
            });
          } finally {
            this.addOutput = false;

            this.item = "";
            this.outputCantidad = "";
            this.outputFactura = "";
            this.outputGuia = "";
            this.outputEntregado = "";
            this.outputHojaRegistro = "";
            this.outputObs = "";

            this.$q.notify({
              message: "La salida se ha guardado exitosamente",
              color: "positive",
              textColor: "white",
              type: "positive",
              position: "top"
            });
          }
        });
    }
  }
};
</script>
