module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',  // Nombre del módulo que usarás para importar las variables
          path: '.env',         // Ruta al archivo de variables de entorno
          blacklist: null,
          whitelist: null,
          safe: false,          // Si es true, verificará la existencia de variables requeridas
          allowUndefined: true, // Permite que haya variables sin definir
        },
      ],
    ],
  };
};
