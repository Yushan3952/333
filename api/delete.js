iexport default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { id } = req.body;

  // 真正專案你會連資料庫，這裡先回應成功
  res.status(200).json({ success: true, deletedId: id });
}


    res.status(200).json({ success: true, message: `已刪除點位 ${id}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
