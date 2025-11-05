# プロジェクト実行までのトラブルシューティングまとめ

このドキュメントは、プロジェクトを正常に実行するまでに行ったトラブルシューティングの過程と、その中で適用した工夫をまとめたものです。

## 工夫した点・解決のポイント

今回のトラブルシューティングでは、以下の点を工夫して問題解決にあたりました。

1.  **設定ファイルからプロジェクト構造を把握:**
    `package.json` や `vite.config.ts` を最初に確認することで、プロジェクトが「Vite + React + TypeScript」製であることを特定し、適切な実行コマンド (`npm run dev`) や設定箇所を素早く見つけ出しました。

2.  **エラーメッセージからの根本原因の特定:**
    *   `HUGGING_FACE_API_KEY is not set`: 環境変数の設定不備が原因であると特定し、Git管理外の `.env` ファイルの作成を提案しました。
    *   `Can't enumerate devices`: スマートフォンでのみ発生したこのエラーと `BarcodeScanner.tsx` の存在から、カメラ機能にはHTTPS接続が必須であると推論し、開発サーバーのHTTPS化を提案しました。
    *   `Cannot find package '@vitejs/plugin-basic-ssl'`: `npm install` をしても発生したこのエラーに対し、`npm install` の出力が `up to date` であったことから、`package.json` に依存関係が記録されていないことが真の原因であると突き止めました。

3.  **環境に応じた柔軟な対応:**
    *   **IPアドレスの確認:** ユーザーのOSがWindowsであることを踏まえ、`ipconfig` コマンドを提案しました。
    *   **CLIツールの実行制限への対応:** 私の環境ではPowerShellの実行ポリシーにより `npm install` が失敗しました。そこで、コマンド実行に固執せず、代わりに `vite.config.ts` や `package.json` を直接編集し、ユーザー自身に `npm install` を実行してもらうというアプローチに切り替え、問題を回避しました。

---

## トラブルシューティングの履歴

### Q1: ソースコードの実行方法は？
**A1:** `package.json` の内容から、`npm install` で依存関係をインストールし、`npm run dev` で開発サーバーを起動する方法を提案しました。

### Q2: 使用されるポートは？
**A2:** `vite.config.ts` を確認し、`server.port` が `3000` に設定されていることを特定しました。

### Q3: `index.html` は開くが中身が表示されない。
**A3:** `index.html`, `index.tsx`, `App.tsx` を確認。コードの構造は正常であったため、開発サーバーが起動していない可能性を指摘し、`npm run dev` の実行とブラウザのコンソール確認を促しました。

### Q4: `HUGGING_FACE_API_KEY environment variable is not set` というエラーが出る。
**A4:** エラーメッセージに基づき、Hugging FaceのAPIキーが設定されていないと判断。プロジェクトルートに `.env` ファイルを作成し、APIキーを記述する方法を案内しました。

### Q5: 不足していそうなソースコードは？
**A5:** `.gitignore` と `README.md` を確認。APIキーなどを記述する `.env` ファイルが意図的にGit管理から除外されていることを突き止め、これが不足している主要なファイルであると結論付けました。

### Q6: スマートフォンで実行するには？
**A6:** `vite.config.ts` の `host: '0.0.0.0'` 設定に基づき、PCで開発サーバーを起動し、同じWi-Fi内のスマートフォンから `http://<PCのIPアドレス>:3000` でアクセスする方法を案内しました。

### Q7: スマホで `Error - Can't enumerate devices` というエラーが出る。
**A7:** カメラ機能の利用にはHTTPS接続が必要であると判断。解決策として、開発サーバーをHTTPS化するプラグイン (`@vitejs/plugin-basic-ssl`) の導入を提案しました。

### Q8: `npm install` がPowerShellのエラーで失敗する。
**A8:** PowerShellの実行ポリシーが原因と判断。ポリシー変更を試みましたが、私の環境では成功しませんでした。

### Q9: `npm run dev` で `@vitejs/plugin-basic-ssl` が見つからないエラーが出る。
**A9:** `npm install` を実行しても `up to date` となりパッケージがインストールされない状況から、`package.json` に依存関係が記録されていないことが根本原因だと特定。`package.json` に `@vitejs/plugin-basic-ssl` を追記し、再度 `npm install` を実行してもらうことで解決しました。
