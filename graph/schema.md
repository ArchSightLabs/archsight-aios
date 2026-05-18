# Knowledge Graph Schema

## 核心实体

| 实体 | 说明 |
| --- | --- |
| Standard | 标准或规范 |
| Clause | 条文 |
| Requirement | 审查要求 |
| BuildingElement | 建筑或 BIM 构件 |
| IfcEntity | IFC 实体 |
| PropertySet | 属性集 |
| Rule | 审查规则 |

## 核心关系

| 关系 | 说明 |
| --- | --- |
| CONTAINS | 标准包含条文 |
| APPLIES_TO | 要求适用于对象 |
| DERIVED_FROM | 规则来源于条文 |
| CONFLICTS_WITH | 条文或规则冲突 |
| REFERENCES | 引用外部标准 |

## 约束

所有实体和关系必须保留来源、版本和置信度。

