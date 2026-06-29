import type { Locale } from "@/lib/i18n";

export type LocalizedStaticKey = "about" | "quality" | "applications" | "faq" | "torqueConverter";

type StaticPageCopy = {
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  intro: string;
  sections: Array<{ title: string; body: string }>;
  primaryCta: string;
  secondaryCta: string;
};

export const LOCALIZED_STATIC_COPY: Record<Locale, Record<LocalizedStaticKey, StaticPageCopy>> = {
  ja: {
    about: {
      title: "TEAOについて | ダンパー・モーションコントロール部品メーカー",
      description: "TEAOは2001年創業のダンパー・モーションコントロール部品メーカーです。自動車、家電、産業用途向けに標準品とカスタム品を提供します。",
      eyebrow: "会社情報",
      h1: "精密ダンパーとソフトモーション機構に特化したメーカー。",
      intro: "TEAOはギアダンパー、ロータリーダンパー、アキシャルダンパー、バレルダンパー、グローブボックスダンパー、ラッチ、カスタムモジュールを提供しています。",
      sections: [
        { title: "20年以上の量産経験", body: "自動車内装、家電、浴室設備、医療機器、産業機構など、静かで安定した動きを必要とする用途に対応しています。" },
        { title: "エンジニアリング対応", body: "目標トルク、動作方向、取付スペース、寿命、温度条件、年間数量を確認し、適切なダンパー構造を提案します。" },
        { title: "品質と供給", body: "IATF 16949を重視した品質管理、トルク検査、外観検査、量産トレーサビリティにより、OEMおよびTier-1案件に対応します。" },
        { title: "5つの製品ライン", body: "ギア / ロータリーダンパー、アキシャル / バレルダンパー、グローブボックスダンパー、ラッチ、カスタムモジュールを展開しています。" },
        { title: "社内製造能力", body: "金型、射出成形、組立、超音波溶着、検査までを一貫管理し、開発から量産までのスピードと品質を両立します。" },
        { title: "グローバルB2B対応", body: "図面レビュー、サンプル評価、量産検証、輸出梱包まで、海外OEM、Tier-1、産業顧客の調達プロセスに対応します。" },
      ],
      primaryCta: "製品を見る",
      secondaryCta: "お問い合わせ",
    },
    quality: {
      title: "品質管理 | TEAO ダンパー試験と検査",
      description: "TEAOの品質管理、トルク試験、寿命試験、温度試験、外観検査について紹介します。",
      eyebrow: "品質管理",
      h1: "量産ダンパーの安定したトルクと静音性能を検証します。",
      intro: "自動車用途では、トルクばらつき、異音、温度変化、寿命が使用感に直結します。TEAOは工程管理と試験で量産品質を確認します。",
      sections: [
        { title: "トルク検査", body: "標準品とカスタム品に対して、目標トルク範囲、動作方向、戻り感、速度安定性を確認します。" },
        { title: "環境・寿命試験", body: "低温、高温、温度サイクル、耐久動作、騒音確認など、用途に応じた検証計画を設定します。" },
        { title: "量産トレーサビリティ", body: "原材料、シリコーンオイル、成形、組立、検査結果を管理し、安定した量産供給を支えます。" },
        { title: "100%検査の考え方", body: "ダンパーの使用感は小さなばらつきでも変わるため、重要工程ではトルク、外観、組立状態を重点的に確認します。" },
        { title: "自動車品質要求", body: "IATF 16949を重視した工程管理により、内装機構、充電口カバー、収納部品などの量産要求に対応します。" },
        { title: "試作から量産まで", body: "サンプル評価後、金型、工程条件、検査基準を整理し、量産時に同じ手感と性能を再現できるよう管理します。" },
      ],
      primaryCta: "品質資料を相談",
      secondaryCta: "製品を見る",
    },
    applications: {
      title: "ダンパー用途 | 自動車・家電・産業機構",
      description: "自動車内装、充電口カバー、手袋箱、扶手箱、家電、浴室設備、産業機構におけるTEAOダンパー用途。",
      eyebrow: "用途",
      h1: "静かで高級感のある動きを必要とする機構にダンパーを使用します。",
      intro: "EVの車内は非常に静かなため、眼鏡ケース、手袋箱、扶手箱、充電口カバーなどの機械音が目立ちます。適切なダンパーは動きを滑らかにし、ブランド感を高めます。",
      sections: [
        { title: "自動車内装", body: "ルーフグラブハンドル、オーバーヘッドコンソール、グローブボックス、センターコンソールリッド、カップホルダーなどに対応します。" },
        { title: "EV外装機構", body: "充電口カバーには、開閉時の衝撃、振動、異音、温度変化に配慮したダンパー選定が必要です。" },
        { title: "その他用途", body: "家電のフタ、浴室設備、医療機器カバー、産業アクセスパネルなど、制御された動きが必要な場所に使用できます。" },
        { title: "浴室・衛生設備", body: "便座、キャビネット扉、シャワー部品、ビデ機構など、ゆっくり閉じる動きや静音性が求められる箇所に使用できます。" },
        { title: "オフィス機器", body: "プリンターカバー、スキャナーリッド、ディスプレイマウント、ワークステーション収納などの制御開閉に対応します。" },
        { title: "産業機構", body: "アクセスドア、設備カバー、サービスパネル、自動販売機機構など、安全で予測しやすい動きが必要な構造に適用できます。" },
      ],
      primaryCta: "自動車用途を見る",
      secondaryCta: "製品を見る",
    },
    faq: {
      title: "FAQ | TEAO ダンパー選定と見積",
      description: "ダンパー選定、カスタム見積、MOQ、トルク、図面、用途情報についてのよくある質問。",
      eyebrow: "FAQ",
      h1: "ダンパー選定と見積に必要な情報。",
      intro: "最適な提案には、用途、取付スペース、目標トルクまたは減衰力、動作方向、寿命条件、年間数量が必要です。",
      sections: [
        { title: "見積に必要な情報", body: "製品図面、3Dデータ、動作角度、目標速度、トルク範囲、使用温度、年間数量を共有してください。" },
        { title: "標準品とカスタム品", body: "標準品で適合できる場合は早く評価できます。特殊な動きやスペース制約がある場合はカスタム設計を検討します。" },
        { title: "評価サンプル", body: "用途条件が明確であれば、既存モデルまたは近いトルク仕様のサンプルを提案できます。" },
        { title: "トルクだけで選ばない理由", body: "重量、回転中心、レバー長、目標速度、取付角度によって実際の手感が変わるため、機構条件を合わせて確認します。" },
        { title: "温度条件", body: "シリコーンオイルの粘度は温度の影響を受けるため、低温・高温での動作速度や戻り感を評価する必要があります。" },
        { title: "量産前の確認", body: "寿命、騒音、トルクばらつき、組立公差、材料適合性を確認してから量産仕様を確定します。" },
      ],
      primaryCta: "見積を依頼",
      secondaryCta: "製品を見る",
    },
    torqueConverter: {
      title: "トルク換算 | TEAO ダンパー選定ツール",
      description: "gf.cm、kgf.cm、N.mなどの単位換算により、ダンパー選定時のトルク比較を簡単にします。",
      eyebrow: "トルク換算",
      h1: "ダンパー選定のためのトルク単位を整理します。",
      intro: "図面、試験データ、サプライヤー資料では異なる単位が使われることがあります。単位を揃えることで、仕様確認と見積依頼がスムーズになります。",
      sections: [
        { title: "よく使う単位", body: "gf.cm、kgf.cm、N.m、N.mmなどを用途に合わせて確認します。" },
        { title: "選定時の注意", body: "重量だけではなく、回転中心、レバー長、動作角度、希望速度を合わせて確認してください。" },
        { title: "エンジニアリング相談", body: "単位換算後、実際の機構条件を共有いただければ、TEAOが近い製品や評価方向を提案します。" },
        { title: "回転ダンパー", body: "ギア / ロータリーダンパーでは、回転軸、歯車比、開閉角度、片方向または双方向の減衰方向を確認します。" },
        { title: "直線ダンパー", body: "アキシャル / バレルダンパーでは、ストローク、押し込み方向、戻り速度、取付スペースを合わせて確認します。" },
        { title: "試験値との比較", body: "机上計算は参考値です。最終仕様は実機サンプルでの速度、音、手感を確認して決定します。" },
      ],
      primaryCta: "問い合わせる",
      secondaryCta: "製品を見る",
    },
  },
  de: {
    about: {
      title: "Über TEAO | Hersteller für Dämpfer und Motion-Control-Komponenten",
      description: "TEAO ist ein Hersteller für Dämpfer und Motion-Control-Komponenten seit 2001, mit Standard- und kundenspezifischen Lösungen für Automotive, Haushaltsgeräte und Industrie.",
      eyebrow: "Über uns",
      h1: "Ein Hersteller mit Fokus auf präzise Dämpfer und Soft-Motion-Mechanismen.",
      intro: "TEAO liefert Zahnrad-Dämpfer, Rotationsdämpfer, Axialdämpfer, Barrel-Dämpfer, Handschuhfachdämpfer, Verriegelungen und kundenspezifische Module.",
      sections: [
        { title: "Mehr als 20 Jahre Serienerfahrung", body: "Wir bedienen Anwendungen in Fahrzeuginnenräumen, Haushaltsgeräten, Sanitärtechnik, Medizintechnik und Industrie, in denen ruhige und kontrollierte Bewegung wichtig ist." },
        { title: "Technische Unterstützung", body: "Wir prüfen Zielmoment, Bewegungsrichtung, Bauraum, Lebensdauer, Temperaturbedingungen und Jahresmenge, um eine geeignete Dämpferstruktur vorzuschlagen." },
        { title: "Qualität und Lieferung", body: "IATF-16949-orientierte Qualitätskontrolle, Drehmomentprüfung, Sichtprüfung und Rückverfolgbarkeit unterstützen OEM- und Tier-1-Projekte." },
        { title: "Fünf Produktlinien", body: "TEAO liefert Zahnrad- / Rotationsdämpfer, Axial- / Barrel-Dämpfer, Handschuhfachdämpfer, Verriegelungen und kundenspezifische Module." },
        { title: "Interne Fertigung", body: "Werkzeugbau, Spritzguss, Montage, Ultraschallschweißen und Prüfung werden intern gesteuert, um Entwicklungszeit und Serienqualität besser zu kontrollieren." },
        { title: "Globale B2B-Unterstützung", body: "Von Zeichnungsprüfung und Musterbewertung bis Serienvalidierung und Exportverpackung unterstützt TEAO internationale OEM-, Tier-1- und Industriekunden." },
      ],
      primaryCta: "Produkte ansehen",
      secondaryCta: "Kontakt aufnehmen",
    },
    quality: {
      title: "Qualitätskontrolle | TEAO Dämpferprüfung und Inspektion",
      description: "TEAO Qualitätskontrolle mit Drehmomentprüfung, Lebensdauerprüfung, Temperaturprüfung und Sichtprüfung für Dämpfer.",
      eyebrow: "Qualitätskontrolle",
      h1: "Wir prüfen stabiles Drehmoment und leise Bewegung für Seriendämpfer.",
      intro: "In Automotive-Anwendungen beeinflussen Drehmomentstreuung, Geräusche, Temperaturdrift und Lebensdauer direkt die wahrgenommene Qualität. TEAO validiert diese Punkte durch Prozesskontrolle und Tests.",
      sections: [
        { title: "Drehmomentprüfung", body: "Für Standard- und kundenspezifische Produkte prüfen wir Zielmoment, Bewegungsrichtung, Rückstellgefühl und Geschwindigkeitsstabilität." },
        { title: "Umwelt- und Lebensdauertests", body: "Je nach Anwendung planen wir Prüfungen bei niedriger und hoher Temperatur, Temperaturwechsel, Dauerlauf und Geräuschkontrolle." },
        { title: "Rückverfolgbarkeit in der Serie", body: "Material, Silikonöl, Spritzguss, Montage und Prüfergebnisse werden dokumentiert, um stabile Serienlieferungen zu unterstützen." },
        { title: "100%-Prüfphilosophie", body: "Da kleine Abweichungen das Bewegungsgefühl verändern können, werden Drehmoment, Optik und Montagezustand in kritischen Prozessen besonders kontrolliert." },
        { title: "Automotive-Anforderungen", body: "IATF-16949-orientierte Prozesskontrolle unterstützt Serienanforderungen für Innenraummechanismen, Ladeanschlussklappen und Ablagefächer." },
        { title: "Von Muster bis Serie", body: "Nach der Musterbewertung werden Werkzeug, Prozessparameter und Prüfkriterien definiert, damit das gleiche Bewegungsgefühl in der Serie reproduzierbar bleibt." },
      ],
      primaryCta: "Qualitätsdaten anfragen",
      secondaryCta: "Produkte ansehen",
    },
    applications: {
      title: "Dämpferanwendungen | Automotive, Haushaltsgeräte und Industrie",
      description: "TEAO Dämpfer für Fahrzeuginnenräume, Ladeanschlussklappen, Handschuhfächer, Armlehnen, Haushaltsgeräte, Sanitärtechnik und Industrie.",
      eyebrow: "Anwendungen",
      h1: "Dämpfer werden dort eingesetzt, wo Bewegung leise, kontrolliert und hochwertig wirken muss.",
      intro: "Da Elektrofahrzeuge sehr leise sind, fallen mechanische Geräusche von Brillenfach, Handschuhfach, Mittelarmlehne oder Ladeanschlussklappe stärker auf. Ein geeigneter Dämpfer macht die Bewegung ruhiger und hochwertiger.",
      sections: [
        { title: "Fahrzeuginnenraum", body: "Dämpfer passen zu Dachhaltegriffen, Dachkonsolen, Handschuhfächern, Mittelkonsolen-Deckeln, Cupholdern und weiteren Innenraummechanismen." },
        { title: "EV-Außenmechanismen", body: "Bei Ladeanschlussklappen müssen Schlag, Schwingung, Geräusch, Temperatur und Umwelteinflüsse bei der Dämpferauswahl berücksichtigt werden." },
        { title: "Weitere Anwendungen", body: "Auch Haushaltsgeräte, Sanitärtechnik, Medizingeräteabdeckungen und industrielle Serviceklappen profitieren von kontrollierter Bewegung." },
        { title: "Bad und Sanitär", body: "WC-Sitze, Schranktüren, Duschkomponenten und Bidet-Mechanismen nutzen Dämpfer für leises und langsames Schließen." },
        { title: "Bürogeräte", body: "Druckerabdeckungen, Scannerdeckel, Displayhalterungen und Arbeitsplatzablagen profitieren von kontrollierter Öffnungs- und Schließbewegung." },
        { title: "Industriemechanismen", body: "Zugangstüren, Geräteabdeckungen, Servicepaneele und Verkaufsautomaten benötigen sichere und vorhersehbare Bewegung." },
      ],
      primaryCta: "Automotive-Anwendungen",
      secondaryCta: "Produkte ansehen",
    },
    faq: {
      title: "FAQ | TEAO Dämpferauswahl und Angebot",
      description: "Häufige Fragen zu Dämpferauswahl, kundenspezifischem Angebot, MOQ, Drehmoment, Zeichnungen und Anwendungsdaten.",
      eyebrow: "FAQ",
      h1: "Welche Daten werden für Dämpferauswahl und Angebot benötigt?",
      intro: "Für eine passende Empfehlung benötigen wir Anwendung, Bauraum, Zielmoment oder Dämpfungskraft, Bewegungsrichtung, Lebensdauerbedingungen und Jahresmenge.",
      sections: [
        { title: "Daten für ein Angebot", body: "Bitte teilen Sie Zeichnung, 3D-Daten, Öffnungswinkel, Zielgeschwindigkeit, Drehmomentbereich, Temperaturbereich und Jahresmenge mit." },
        { title: "Standard oder kundenspezifisch", body: "Wenn ein Standardmodell passt, ist die Bewertung schneller. Bei besonderen Bewegungen oder engem Bauraum prüfen wir eine kundenspezifische Lösung." },
        { title: "Musterbewertung", body: "Sind die Anwendungsbedingungen klar, können wir vorhandene Modelle oder ähnliche Drehmomentbereiche für erste Tests vorschlagen." },
        { title: "Warum nicht nur nach Drehmoment wählen?", body: "Gewicht, Drehpunkt, Hebellänge, Zielgeschwindigkeit und Einbauwinkel verändern das reale Bewegungsgefühl und müssen zusammen bewertet werden." },
        { title: "Temperaturbedingungen", body: "Die Viskosität von Silikonöl wird durch Temperatur beeinflusst. Geschwindigkeit und Rückstellgefühl sollten bei niedriger und hoher Temperatur geprüft werden." },
        { title: "Vor Serienfreigabe", body: "Lebensdauer, Geräusch, Drehmomentstreuung, Montagetoleranzen und Materialverträglichkeit sollten vor der Serienspezifikation validiert werden." },
      ],
      primaryCta: "Anfrage senden",
      secondaryCta: "Produkte ansehen",
    },
    torqueConverter: {
      title: "Drehmomentrechner | TEAO Dämpferauswahl",
      description: "Einheiten wie gf.cm, kgf.cm und N.m vergleichen, um Drehmomente für die Dämpferauswahl besser einzuordnen.",
      eyebrow: "Drehmomentrechner",
      h1: "Drehmomenteinheiten für die Dämpferauswahl sauber vergleichen.",
      intro: "Zeichnungen, Testdaten und Lieferantendokumente verwenden oft unterschiedliche Einheiten. Einheitliche Werte erleichtern Spezifikation, Vergleich und Anfrage.",
      sections: [
        { title: "Häufige Einheiten", body: "gf.cm, kgf.cm, N.m und N.mm werden je nach Anwendung und Prüfaufbau verwendet." },
        { title: "Auswahlhinweis", body: "Berücksichtigen Sie neben dem Gewicht auch Drehpunkt, Hebellänge, Öffnungswinkel und gewünschte Geschwindigkeit." },
        { title: "Technische Beratung", body: "Nach der Umrechnung kann TEAO anhand Ihrer Mechanikdaten geeignete Produkte oder Testbereiche vorschlagen." },
        { title: "Rotationsdämpfer", body: "Bei Zahnrad- / Rotationsdämpfern sind Drehachse, Übersetzung, Öffnungswinkel und ein- oder zweiseitige Dämpfungsrichtung wichtig." },
        { title: "Lineardämpfer", body: "Bei Axial- / Barrel-Dämpfern müssen Hub, Druckrichtung, Rückstellgeschwindigkeit und Bauraum zusammen betrachtet werden." },
        { title: "Vergleich mit Tests", body: "Berechnungen sind nur Ausgangswerte. Die finale Spezifikation sollte über Musterprüfung von Geschwindigkeit, Geräusch und Haptik bestätigt werden." },
      ],
      primaryCta: "Kontakt aufnehmen",
      secondaryCta: "Produkte ansehen",
    },
  },
};

export function getLocalizedStaticCopy(locale: Locale, key: LocalizedStaticKey) {
  return LOCALIZED_STATIC_COPY[locale][key];
}
