// Register each file as a corresponding Vuex module. Module nesting
// will mirror [sub-]directory hierarchy and modules are namespaced
// as the camelCase equivalent of their file name.
//这段代码是用于动态注册Vuex模块的代码。它首先导入了lodash库中的camelCase方法，然后定义了一个空的storeData对象，该对象包含一个modules属性，用于存储所有的Vuex模块。接着，它使用webpack的require.context方法来动态地获取所有的Vuex模块文件，并注册它们为Vuex模块。模块的嵌套结构将会反映文件夹层次结构，模块的命名空间将使用驼峰式命名法表示。在模块更新时，它使用热重载来更新模块的定义，并使用getNamespace函数来递归获取模块的命名空间。最后，它导出storeData.modules对象，该对象包含了所有的Vuex模块。

import camelCase from 'lodash/camelCase'

const modulesCache = {}
const storeData = { modules: {} }

;(function updateModules() {
  // Allow us to dynamically require all Vuex module files.
  // https://webpack.js.org/guides/dependency-management/#require-context
  const requireModule = require.context(
    // Search for files in the current directory.
    '.',
    // Search for files in subdirectories.
    true,
    // Include any .js files that are not this file or a unit test.
    /^((?!index|\.unit\.).)*\.js$/
  )

  // For every Vuex module...
  requireModule.keys().forEach((fileName) => {
    const moduleDefinition = requireModule(fileName)

    // Skip the module during hot reload if it refers to the
    // same module definition as the one we have cached.
    if (modulesCache[fileName] === moduleDefinition) return

    // Update the module cache, for efficient hot reloading.
    modulesCache[fileName] = moduleDefinition

    // Get the module path as an array.
    const modulePath = fileName
      // Remove the "./" from the beginning.
      .replace(/^\.\//, '')
      // Remove the file extension from the end.
      .replace(/\.\w+$/, '')
      // Split nested modules into an array path.
      .split(/\//)
      // camelCase all module namespaces and names.
      .map(camelCase)

    // Get the modules object for the current path.
    const { modules } = getNamespace(storeData, modulePath)

    // Add the module to our modules object.
    modules[modulePath.pop()] = {
      // Modules are namespaced by default.
      namespaced: true,
      ...moduleDefinition,
    }
  })

  // If the environment supports hot reloading...
  if (module.hot) {
    // Whenever any Vuex module is updated...
    module.hot.accept(requireModule.id, () => {
      // Update `storeData.modules` with the latest definitions.
      updateModules()
      // Trigger a hot update in the store.
      require('../store').default.hotUpdate({ modules: storeData.modules })
    })
  }
})()

// Recursively get the namespace of a Vuex module, even if nested.
function getNamespace(subtree, path) {
  if (path.length === 1) return subtree

  const namespace = path.shift()
  subtree.modules[namespace] = {
    modules: {},
    namespaced: true,
    ...subtree.modules[namespace],
  }
  return getNamespace(subtree.modules[namespace], path)
}

export default storeData.modules
