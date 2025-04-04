export default {
  roots: ['<rootDir>/src', '<rootDir>/test'], // Inclua o diretório "test"
  testMatch: ['**/*.spec.ts'], // Certifique-se de que os arquivos terminando em ".spec.ts" sejam encontrados
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};
