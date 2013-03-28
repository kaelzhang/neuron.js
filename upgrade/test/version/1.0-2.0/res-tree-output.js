AST_Toplevel 
  body: AST_SimpleStatement 
    body: AST_Call 
      args: AST_Array 
      args: AST_Function 
        argnames: AST_SymbolFunarg 
          name: string D
        argnames: AST_SymbolFunarg 
          name: string require
        argnames: AST_SymbolFunarg 
          name: string exports
        body: AST_Var 
          definitions: AST_VarDef 
            name: AST_SymbolVar 
              name: string _$
            value: AST_SymbolRef 
              name: string $
          definitions: AST_VarDef 
            name: AST_SymbolVar 
              name: string element
            value: AST_Number 
        body: AST_Var 
          definitions: AST_VarDef 
            name: AST_SymbolVar 
              name: string NR_local
        body: AST_Var 
          definitions: AST_VarDef 
            name: AST_SymbolVar 
              name: string selector
            value: AST_String 
        body: AST_SimpleStatement 
          body: AST_Call 
            args: AST_String 
            expression: AST_Dot 
              expression: AST_Call 
                args: AST_String 
                expression: AST_SymbolRef 
                  name: string _$
              property: string css
        body: AST_SimpleStatement 
          body: AST_Call 
            args: AST_String 
            expression: AST_Dot 
              expression: AST_Call 
                args: AST_SymbolRef 
                  name: string selector
                expression: AST_SymbolRef 
                  name: string $
              property: string css
        body: AST_SimpleStatement 
          body: AST_Call 
            args: AST_String 
            expression: AST_Dot 
              expression: AST_Call 
                args: AST_SymbolRef 
                  name: string selector
                expression: AST_Dot 
                  expression: AST_SymbolRef 
                    name: string D
                  property: string DOM
              property: string css
        body: AST_SimpleStatement 
          body: AST_Call 
            args: AST_String 
            expression: AST_Dot 
              expression: AST_Call 
                args: AST_SymbolRef 
                  name: string selector
                expression: AST_Dot 
                  expression: AST_SymbolRef 
                    name: string DP
                  property: string DOM
              property: string css
        body: AST_SimpleStatement 
          body: AST_Call 
            args: AST_String 
            args: AST_Number 
            expression: AST_Dot 
              expression: AST_Call 
                args: AST_String 
                expression: AST_Dot 
                  expression: AST_SymbolRef 
                    name: string $
                  property: string all
              property: string css
        body: AST_SimpleStatement 
          body: AST_Call 
            args: AST_String 
            args: AST_Number 
            expression: AST_Dot 
              expression: AST_Call 
                args: AST_String 
                expression: AST_Dot 
                  expression: AST_SymbolRef 
                    name: string $
                  property: string one
              property: string css
        body: AST_Var 
          definitions: AST_VarDef 
            name: AST_SymbolVar 
              name: string a
            value: AST_Call 
              args: AST_String 
              expression: AST_Dot 
                expression: AST_Call 
                  args: AST_String 
                  expression: AST_Dot 
                    expression: AST_SymbolRef 
                      name: string $
                    property: string all
                property: string find
        body: AST_SimpleStatement 
          body: AST_Call 
            args: AST_String 
            expression: AST_Dot 
              expression: AST_Call 
                args: AST_String 
                expression: AST_Dot 
                  expression: AST_Call 
                    args: AST_String 
                    expression: AST_Dot 
                      expression: AST_Call 
                        args: AST_String 
                        expression: AST_Dot 
                          expression: AST_SymbolRef 
                            name: string a
                          property: string next
                      property: string next
                  property: string child
              property: string one
        body: AST_If 
          body: AST_BlockStatement 
            body: AST_SimpleStatement 
              body: AST_Assign 
        body: AST_Var 
          definitions: AST_VarDef 
            name: AST_SymbolVar 
              name: string K
        body: AST_SimpleStatement 
          body: AST_Call 
            args: AST_SymbolRef 
              name: string abc
            expression: AST_Dot 
              expression: AST_SymbolRef 
                name: string K
              property: string _type
        body: AST_SimpleStatement 
          body: AST_Assign 
        body: AST_SimpleStatement 
          body: AST_Call 
            args: AST_Dot 
              expression: AST_SymbolRef 
                name: string K
              property: string b
            args: AST_Object 
            expression: AST_Dot 
              expression: AST_SymbolRef 
                name: string DP
              property: string mix
        body: AST_Defun 
          argnames: AST_Defun []
          name: AST_SymbolDefun 
            name: string a
          body: AST_Var 
            definitions: AST_VarDef 
              name: AST_SymbolVar 
                name: string DP
              value: AST_SymbolRef 
                name: string K
          body: AST_SimpleStatement 
            body: AST_Call 
              args: AST_Call []
              expression: AST_Dot 
                expression: AST_SymbolRef 
                  name: string DP
                property: string mix
          body: AST_SimpleStatement 
            body: AST_Call 
              args: AST_Call []
              expression: AST_Dot 
                expression: AST_SymbolRef 
                  name: string NR
                property: string mix
        body: AST_EmptyStatement 
      expression: AST_Dot 
        expression: AST_SymbolRef 
          name: string DP
        property: string define
