import allModules from '@state/modules'
import store from '@state/store'
//这是一个JavaScript函数，用于在Vuex store中派发指定的action到所有模块中。函数接受三个参数：actionName（字符串类型，表示要派发的action名称），options（一个包含modules、modulePrefix和flags属性的对象，用于指定要派发的模块、模块前缀和派发标志）。该函数使用递归方式遍历所有的模块，检查每个模块是否定义了指定的action，并在发现定义时派发该action。如果模块是有命名空间的，则使用模块前缀来派发action；否则，将标志设置为在最后全局派发。如果有嵌套的子模块，则也会为这些子模块派发action。最后，如果在根模块中发现至少一个非命名空间模块定义了该action，则使用全局方式派发该action。
export default function dispatchActionForAllModules(
  actionName,
  { modules = allModules, modulePrefix = '', flags = {} } = {}
) {
  // For every module...
  for (const moduleName in modules) {
    const moduleDefinition = modules[moduleName]

    // If the action is defined on the module...
    if (moduleDefinition.actions && moduleDefinition.actions[actionName]) {
      // Dispatch the action if the module is namespaced. Otherwise,
      // set a flag to dispatch the action globally at the end.
      if (moduleDefinition.namespaced) {
        store.dispatch(`${modulePrefix}${moduleName}/${actionName}`)
      } else {
        flags.dispatchGlobal = true
      }
    }

    // If there are any nested sub-modules...
    if (moduleDefinition.modules) {
      // Also dispatch the action for these sub-modules.
      dispatchActionForAllModules(actionName, {
        modules: moduleDefinition.modules,
        modulePrefix: modulePrefix + moduleName + '/',
        flags,
      })
    }
  }

  // If this is the root and at least one non-namespaced module
  // was found with the action...
  if (!modulePrefix && flags.dispatchGlobal) {
    // Dispatch the action globally.
    store.dispatch(actionName)
  }
}
