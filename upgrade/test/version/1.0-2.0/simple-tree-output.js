AST_Toplevel 
  body: AST_Var 
    definitions: AST_Null 
  body: AST_SimpleStatement 
    body: AST_Assign 
      left: AST_SymbolRef 
        name: string $_local
      operator: string =
      right: AST_Dot 
        expression: AST_SymbolRef 
          name: string NR
        property: string DOM
