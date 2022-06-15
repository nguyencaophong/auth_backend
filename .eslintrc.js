module.exports = {
    'rules': {
        'eqeqeq': 'off',
        'curly': 'error',
        'quotes': ['error', 'single'],
        'comma-dangle': ['error', 'never'],
        'indent': ['error', 4],
        'no-multiple-empty-lines': 'error',
        'semi-style': ['error', 'last']
    },
    'parserOptions': {
        'ecmaVersion': 2021
    },
    
    // nơi cấu hình code chúng ta sẽ chạy. môi trường khác nhau biến toàn cục khác nhau.
    'env': {
        'es6': true
    }
};
