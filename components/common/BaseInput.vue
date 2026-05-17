<template>
  <div class="input-stack">
    <label v-if="label" :for="inputId" class="input-label">
      {{ label }}
      <span v-if="required" class="required-indicator">*</span>
    </label>
    
    <div class="input-wrapper">
      <slot name="prefix" />
      
      <!-- 
        Input element with attribute forwarding:
        - v-bind="inputAttrs" spreads all non-class attributes (name, autocomplete, etc.)
        - Explicit props are defined separately for validation and component logic
        - :class merges component classes with user-provided classes
      -->
      <input 
        v-bind="inputAttrs"
        :id="inputId"
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :class="inputClassList"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
   
      <slot name="suffix" />
    </div>
    
    <p v-if="helperText && !error" class="helper-text">
      {{ helperText }}
    </p>
    
    <p v-if="error" class="error-text">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
/**
 * BaseInput - A flexible, accessible input component
 * 
 * @component
 * @description A reusable input field with label, validation states, and slot support
 * 
 * @example
 * <!-- Basic usage -->
 * <BaseInput v-model="name" label="Name" placeholder="Enter your name" />
 * 
 * @example
 * <!-- With validation -->
 * <BaseInput 
 *   v-model="email" 
 *   label="Email" 
 *   type="email" 
 *   :error="emailError" 
 *   required 
 * />
 * 
 * @example
 * <!-- With prefix/suffix -->
 * <BaseInput v-model="search" label="Search">
 *   <template #prefix>🔍</template>
 *   <template #suffix>
 *     <BaseButton size="small">Search</BaseButton>
 *   </template>
 * </BaseInput>
 * 
 * @example
 * <!-- With HTML attributes (automatically forwarded) -->
 * <BaseInput 
 *   v-model="phone" 
 *   label="Phone"
 *   name="phone"
 *   autocomplete="tel"
 *   inputmode="tel"
 *   data-testid="phone-input"
 * />
 */
defineOptions({ inheritAttrs: false })

const attrs = useAttrs()

/**
 * Component props
 * @typedef {Object} BaseInputProps
 * @property {string|number} modelValue - Input value (for v-model support)
 * @property {string} [label] - Label text displayed above the input
 * @property {'text'|'email'|'tel'|'password'|'number'} [type='text'] - Input type
 * @property {string} [placeholder] - Placeholder text
 * @property {boolean} [disabled=false] - Disable the input
 * @property {boolean} [readonly=false] - Make input read-only
 * @property {boolean} [required=false] - Mark as required (shows asterisk)
 * @property {string} [error] - Error message to display
 * @property {string} [helperText] - Helper text displayed below input
 */
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: String,
  type: {
    type: String,
    default: 'text'
  },
  placeholder: String,
  disabled: Boolean,
  readonly: Boolean,
  required: Boolean,
  error: String,
  helperText: String
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus'])

/**
 * Generate a stable, unique ID for the input
 * Uses Vue 3.5's useId() for SSR-safe ID generation
 * @returns {string} Unique input ID (e.g., "input-abc123")
 */
const uid = useId()

const inputId = computed(() => `input-${uid}`)

/**
 * Filter and forward non-class attributes to the input element
 * 
 * This computed property:
 * 1. Takes all attributes passed to <BaseInput>
 * 2. Removes 'class' (handled separately)
 * 3. Returns remaining attributes to bind to the <input>
 * 
 * @example
 * // If you pass: name="email" autocomplete="email" class="my-class"
 * // inputAttrs becomes: { name: "email", autocomplete: "email" }
 * // and 'class' is handled by inputClassList
 */
const inputAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})

/**
 * Generate CSS classes for the input element
 * Combines component base classes with state modifiers
 * 
 * @returns {string[]} Array of CSS class names
 */
const inputClasses = computed(() => {
  const classes = ['input-field']

  if (props.error) classes.push('error')
  if (props.disabled) classes.push('disabled')
  if (props.readonly) classes.push('readonly')

  return classes
})

/**
 * Merge component classes with user-provided classes
 * Ensures proper class inheritance and customization
 * 
 * @returns {string[]} Combined class array
 */
const inputClassList = computed(() => [inputClasses.value, attrs.class])

/**
 * Handle input events and emit v-model updates
 * @param {Event} event - Input event
 */
const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
}

/**
 * Handle blur events
 * @param {Event} event - Blur event
 */
const handleBlur = (event) => {
  emit('blur', event)
}

/**
 * Handle focus events
 * @param {Event} event - Focus event
 */
const handleFocus = (event) => {
  emit('focus', event)
}
</script>

<style scoped>
/* Component-specific overrides only */
</style>
