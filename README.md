# Conference Room Reservation System （会議室予約システム）

## 機能概要

5 種類の会議室（プレゼンテーションルーム、プレゼンテーションルーム A、プレゼンテーションルーム B、研修室、ミーティングルーム）の予約および決済が行える機能を持っています。管理者は過去の予約データの集計や未来の予約状況の確認が可能で、さらに特別な「インキュベートルーム」の予約も管理者限定で行うことができます。また、管理者はゲストの代わりに予約を入れる際にゲストの姓名、メールアドレス、パスワードの入力が必要です。

## 使っている技術の概要

- MySQL: データベース
- FasAPI: Web フレームワーク
- Next.js: Web アプリケーションフレームワーク
- Stripe: オンライン決済システム

## Install、起動手順

#### 1. 環境変数の設定

##### /app/.env に変数を設定する

- MySQL に関する変数の設定

  - MYSQL_USER=　 `Your mysql user name`
  - MYSQL_PASSWORD= `Your mysql password`
  - MYSQL_DATABASE= `Your mysql database name`
  - MYSQL_HOST= `Hostname in mysql`

- MySQL 内のテーブル名の設定

  - USER_TABLE_NAME= `The table name on database for user list`
  - RESERVED_TABLE_NAME= `The table name on database for reservation list`

- Administrator の設定
  - ADMIN_FIRST_NAME= `Administrator's first name`
  - ADMIN_LAST_NAME= `Administrator's last name`
  - ADMIN_ORGANIZATION= `Organization name (if you need)`
  - ADMIN_EMAIL= `Administrator's e-mail`
  - ADMIN_PASSWORD= `Administrator's password`

##### /api/.env に変数を設定する

- Next.js の環境変数を設定する
  - NEXT_PUBLIC_ADMIN_EMAIL= `Same value as ADMIN_EMAIL in /api/.env`
  - NEXT_PUBLIC_ADMIN_PASSWORD= `Same value as ADMIN_PASSWORD in /api/.env`
  - API_URL= `FasAPI's URL`
  - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY= `Public api key for stripe`
  - STRIPE_SECRET_KEY= `Secrete api key for stripe`

#### 2.起動方法

上記の環境変数を用いて、MySQL、FastAPI、Next.js の順で起動する

## 技術や機能の詳細説明

## API Directory

このプロジェクトは FastAPI を使用して、ユーザー管理と認証、予約システムの機能を提供する Web アプリケーションのバックエンドを実装しています。データベース操作は SQLAlchemy を通じて行われ、環境変数で設定されたデータベーステーブルを利用します。

### 主な機能

- **ユーザー管理**：新規ユーザーの作成、ユーザー情報の読み取り、更新、削除。
- **認証**：ユーザーのログイン、アクセストークンの発行、ログアウト。
- **予約管理**：予約の作成、予約情報の読み取り、予約の削除。

### 技術スタック

- **FastAPI**：高速で、簡単に API を構築するためのモダンな Web フレームワーク。
- **SQLAlchemy**：Python の SQL ツールキットおよびオブジェクト関係マッピング（ORM）ツール。
- **Pydantic**：データ検証と設定管理を簡素化するデータパーシングと検証ライブラリ。

### 環境設定

環境変数を利用して以下の設定が必要です：

- **USER_TABLE_NAME**：ユーザーデータを格納するテーブル名。
- **SECRET_KEY**：JWT で使用するシークレットキー。
- **ALGORITHM**：JWT で使用するアルゴリズム。
- **ACCESS_TOKEN_EXPIRE_MINUTES**：アクセストークンの有効期限（分）。

### エンドポイント

##### ユーザー管理

- **POST /user**: 新規ユーザーを作成します。
- **GET /user/{user_id}**: 特定のユーザーを取得します。
- **PUT /user/{user_id}**: 特定のユーザー情報を更新します。
- **DELETE /user/{user_id}**: 特定のユーザーを削除します。

##### 認証

- **POST /token**: ユーザーログインとアクセストークンの発行。
- **POST /logout**: ユーザーをログアウトさせます。

##### 予約管理

- **GET /reserved/user/{user_id}**: 特定のユーザーの予約をすべて取得します。
- **GET /reserved/date/{date}**: 特定の日付の予約をすべて取得します。
- **POST /reserved**: 新規予約を作成します。
- **DELETE /reserved/{reserved_id}**: 特定の予約を削除します。

---

## APP Directry

ユーザーが会議室予約を行えるように、アプリを作成しています。
実際に存在する現場を対象としているので、課題とは若干使用がことなる箇所があるかもしれません。
対象とした会議室は、沖縄県宜野湾市にある[Gwave cafe](https://www.gbic.jp/cafe/ "Gwave cafe") が運営する会議室です。

### 技術スタック

- **React**: ユーザーインターフェースの構築
- **Next.js**: サーバーサイドレンダリングとルーティングの管理
- **FullCalendar**: インタラクティブなカレンダー機能の提供
- **Tailwind CSS**: ユーザーインターフェースのスタイリング
- **react-chartjs-2**: 予約状況の可視化

### 構成

<dl>
  <dt><strong>部屋の種類</strong></dt>
  <dd><strong> - プレゼンテーションルーム</strong></dd>
  <dd><strong> - プレゼンテーションルーム A</strong></dd>
  <dd><strong> - プレゼンテーションルーム B</strong></dd>
  <dd><strong> - 研修室</strong></dd>
  <dd><strong> - ミーティングルーム</strong></dd>
</dl>

プレゼンテーションルームは、プレゼンテーションルーム A とプレゼンテーションルーム B を合わせた部屋です。プレゼンテーションルームの予約がある時間は、プレゼンテーションルーム A、B ともに予約はできません。また、プレゼンテーションルーム A または B が予約がある時間はプレゼンテーションルームは予約はできません。

<dl>
  <dt><strong>利用時間帯</strong></dt>
  <dd><strong> - 09:00 - 12:00</strong></dd>
  <dd><strong> - 09:00 - 17:00</strong></dd>
  <dd><strong> - 09:00 - 21:00</strong></dd>
  <dd><strong> - 13:00 - 17:00</strong></dd>
  <dd><strong> - 13:00 - 21:00</strong></dd>
  <dd><strong> - 18:00 - 21:00</strong></dd>
</dl>
ご利用時間が重なるときは利用不可となります。例えば、予約される際に、すでに<code>09：00-17：00</code>で予約がある場合、同日かつ同部屋の利用可能時間帯は、<code>18:00 - 21:00</code>のみとなります。

#### 利用条件

- 全てのユーザーはサインアップもしくはサインイン後に会議室の予約を行えます。
- 予約は、予約申請日の 2 日後から 2 ヶ月先が予約選択可能日です。
- 毎月第二日曜日は定休日です
- 年末年始の計 6 日間（12/29〜1/3）は定休日です。
- キャンセルは利用開始 3 時間前まで、キャンセルが可能です。
- キャンセル料金は、ご利用日の 14 日前〜8 日前までが利用予定料金の 50％、7 日前〜利用予定料金の 100％が発生します。

### 管理者

- 管理者は上記の部屋と別に**インキュベートルーム**予約可能になっています。
- 管理者画面（Dashboard）では、過去の利用データと今後の利用予定データを基に複数のグラフが表示されます。
- 管理者画面から第三者の予約を行うことも可能ですが、利生者の名前、メールアドレス、パスワードが必須となっています。
- 管理者画面から第三者を管理者にすることが可能で、また、ユーザー情報を削除することも可能です。ユーザーが削除された時、削除されるユーザーが予約した利用予定の予約も同時に削除されます。
